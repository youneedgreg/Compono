import { FormComponentModel } from "@/models/FormComponent";
import { Editor } from "@tiptap/react";
import * as Icons from "lucide-react";
import { HTMLAttributes, HTMLInputTypeAttribute } from 'react';

export type SelectableComponents = {
  id: string;
  label: string;
  type: string;
  icon: keyof typeof Icons;
};

export type Viewports = 'sm' | 'md' | 'lg';

export type DesignPropertiesViews = {
  base: React.ReactNode;
  grid: React.ReactNode;
  html: React.ReactNode;
  label: React.ReactNode;
  input: React.ReactNode;
  button: React.ReactNode;
  options: React.ReactNode;
  validation: React.ReactNode;
};

export type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export interface FormBuilderStore {
  mode: 'editor' | 'preview';
  viewport: Viewports;
  showJson: boolean;
  formTitle: string;
  editor: Editor | null;
  enableDragging: boolean;
  updateMode: (mode: 'editor' | 'preview') => void;
  updateViewport: (viewport: Viewports) => void;
  toggleJsonPreview: () => void;
  updateFormTitle: (title: string) => void;
  setEditor: (editor: Editor | null) => void;
  components: FormComponentModel[];
  selectedComponent: FormComponentModel | null;
  updateEnableDragging: (enableDragging: boolean) => void;
  addComponent: (component: FormComponentModel) => void;
  removeComponent: (componentId: string) => void;
  updateComponent: (componentId: string, field: string, value: any, isValidForAllViewports?: boolean) => void;
  updateComponents: (components: FormComponentModel[]) => void;
  selectComponent: (component: FormComponentModel | null) => void;
  moveComponent: (oldIndex: number, newIndex: number) => void;
} 
