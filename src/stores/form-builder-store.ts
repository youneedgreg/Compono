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
  enableDragging: boolean;
  updateEnableDragging: (value: boolean) => void;
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
  updateComponents: (components: FormComponentModel[]) => void;
  selectComponent: (component: FormComponentModel | null) => void;
  removeComponent: (id: string) => void;
  clearForm: () => void;
  setEditor: (editor: Editor | null) => void;
  history: FormComponentModel[][];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  isHydrated: boolean;
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

export const useFormBuilderStore = create<FormBuilderState>((set, get) => {
  const initialState = {
    viewport: "lg" as Viewport,
    mode: "editor" as Mode,
    componentType: "form" as ComponentType,
    showJson: false,
    formTitle: "Untitled",
    components: [],
    selectedComponent: null,
    editor: null,
    enableDragging: true,
    history: [],
    historyIndex: -1,
    isHydrated: false,
  };

  return {
    ...initialState,
    updateViewport: (viewport) => set({ viewport }),
    updateMode: (mode) => set({ mode }),
    updateComponentType: (componentType) => set({ componentType }),
    toggleJsonPreview: () => set((state) => ({ showJson: !state.showJson })),
    updateFormTitle: (title) => set({ formTitle: title }),
    updateEnableDragging: (value) => set({ enableDragging: value }),
    addComponent: (component) => {
      const newComponent = new FormComponentModel({ ...component });
      let newId = generateComponentId(newComponent, get().components);
      newComponent.id = newId;
      newComponent.attributes = {
        ...newComponent.attributes,
        id: newComponent.id,
      };
      set((state) => {
        const newComponents = [...state.components, newComponent];
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newComponents);
        return {
          components: newComponents,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
      return newComponent;
    },
    updateComponent: (id, path, value, shouldUpdateViewport = true) =>
      set((state) => {
        const newComponents = state.components.map((component) => {
          if (component.id === id) {
            const newComponent = component.clone();
            newComponent.setField(path, value, shouldUpdateViewport);
            return newComponent;
          }
          return component;
        });
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newComponents);
        return {
          components: newComponents,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
    moveComponent: (oldIndex, newIndex) =>
      set((state) => {
        const newComponents = [...state.components];
        const [removed] = newComponents.splice(oldIndex, 1);
        newComponents.splice(newIndex, 0, removed);
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newComponents);
        return {
          components: newComponents,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
    updateComponents: (components) =>
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(components);
        return {
          components,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
    selectComponent: (component) => set({ selectedComponent: component }),
    removeComponent: (id) =>
      set((state) => {
        const newComponents = state.components.filter((c) => c.id !== id);
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newComponents);
        return {
          components: newComponents,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
    clearForm: () =>
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push([]);
        return {
          components: [],
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
    setEditor: (editor) => set({ editor }),
    undo: () =>
      set((state) => {
        if (state.historyIndex > 0) {
          const newHistoryIndex = state.historyIndex - 1;
          return {
            components: state.history[newHistoryIndex],
            historyIndex: newHistoryIndex,
          };
        }
        return {};
      }),
    redo: () =>
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newHistoryIndex = state.historyIndex + 1;
          return {
            components: state.history[newHistoryIndex],
            historyIndex: newHistoryIndex,
          };
        }
        return {};
      }),
  };
});
