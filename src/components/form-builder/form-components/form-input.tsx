import { Input } from "@/components/ui/input";
import { DesignPropertiesViews } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { LabelGroup } from "../sidebar/groups/label-group";
import { InputGroup } from "../sidebar/groups/input-group";
import { GridGroup } from "../sidebar/groups/grid-group";
import { cn, escapeHtml } from "@/lib/utils";
import { ValidationGroup } from "../sidebar/groups/validation-group";
import { ControllerRenderProps } from "react-hook-form";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { useEffect } from "react";
import { useState } from "react";

export function FormInput(component: FormComponentModel, form: UseFormReturn<FieldValues, undefined>, field: ControllerRenderProps) {

  return (
    <Input
      key={component.id}
      placeholder={component.getField("attributes.placeholder")}
      type={component.getField("attributes.type")}
      className={cn(component.getField("attributes.class"))}
      {...field}
      defaultValue={component.value}
    />
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  return {
    code: `
    <Input
      key="${component.id}"
      placeholder="${escapeHtml(component.getField("attributes.placeholder"))}"
      type="${escapeHtml(component.getField("attributes.type"))}"
      id="${escapeHtml(component.getField("attributes.id"))}"
      className="${escapeHtml(component.getField("attributes.class"))}"
      {...field}
    />  
    `,
    dependencies: {
      "@/components/ui/input": ["Input"],
    },
  };
}

export const InputDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: <LabelGroup whitelist={["label", "labelPosition", "labelAlign", "showLabel"]} />,
  input: <InputGroup />,
  options: null,
  button: null,
  validation: <ValidationGroup />,
};
