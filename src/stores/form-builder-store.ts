import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormBuilderStore, Viewports } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { Editor } from "@tiptap/react";

export type Viewport = "sm" | "md" | "lg";
export type Mode = "editor" | "preview";
export type ComponentType = "form" | "sidebar" | "button" | "card" | "dialog" | "dropdown" | "table";

interface FormBuilderState {
  viewport: Viewport;
  mode: Mode;
  componentType: ComponentType;
  showJson: boolean;
  formTitle: string;
  components: FormComponentModel[];
  selectedComponent: FormComponentModel | null;
  editor: Editor | null;
  updateViewport: (viewport: Viewport) => void;
  updateMode: (mode: Mode) => void;
  updateComponentType: (type: ComponentType) => void;
  toggleJsonPreview: () => void;
  updateFormTitle: (title: string) => void;
  addComponent: (component: FormComponentModel) => FormComponentModel;
  updateComponent: (
    id: string,
    path: string,
    value: any,
    shouldUpdateViewport?: boolean
  ) => void;
  moveComponent: (oldIndex: number, newIndex: number) => void;
  selectComponent: (component: FormComponentModel | null) => void;
  setEditor: (editor: Editor | null) => void;
}

const generateComponentId = (
  component: FormComponentModel,
  components: FormComponentModel[]
): string => {
  const existingTypes = components.filter((comp) =>
    comp.getField("type").startsWith(component.getField("type"))
  );

  let counter = existingTypes.length;
  let newId = `${component.getField("id")}-${counter}`;

  return newId;
};

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      viewport: "lg",
      mode: "editor",
      componentType: "form",
      showJson: false,
      formTitle: "Untitled",
      components: [],
      selectedComponent: null,
      editor: null,
      updateViewport: (viewport) => set({ viewport }),
      updateMode: (mode) => set({ mode }),
      updateComponentType: (componentType) => set({ componentType }),
      toggleJsonPreview: () => set((state) => ({ showJson: !state.showJson })),
      updateFormTitle: (title) => set({ formTitle: title }),
      addComponent: (component) => {
        const newComponent = new FormComponentModel({ ...component });
        let newId = generateComponentId(newComponent, get().components);
        newComponent.id = newId;
        newComponent.attributes = {
          ...newComponent.attributes,
          id: newComponent.id,
        };
        set((state) => {
          return { components: [...state.components, newComponent] };
        });

        return newComponent;
      },
      updateComponent: (id, path, value, shouldUpdateViewport = true) =>
        set((state) => ({
          components: state.components.map((component) => {
            if (component.id === id) {
              const newComponent = component.clone();
              newComponent.setField(path, value, shouldUpdateViewport);
              return newComponent;
            }
            return component;
          }),
        })),
      moveComponent: (oldIndex, newIndex) =>
        set((state) => {
          const newComponents = [...state.components];
          const [removed] = newComponents.splice(oldIndex, 1);
          newComponents.splice(newIndex, 0, removed);
          return { components: newComponents };
        }),
      selectComponent: (component) => set({ selectedComponent: component }),
      setEditor: (editor) => set({ editor }),
    }),
    {
      name: "form-builder-storage",
      partialize: (state) => ({
        components: state.components,
        viewport: state.viewport,
        formTitle: state.formTitle,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.components) {
          state.components = state.components.map((component) => {
            return new FormComponentModel(component);
          });
        }
      },
    }
  )
);
