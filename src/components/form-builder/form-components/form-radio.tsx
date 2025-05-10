import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DesignPropertiesViews } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { GridGroup } from "../sidebar/groups/grid-group";
import { LabelGroup } from "../sidebar/groups/label-group";
import { InputGroup } from "../sidebar/groups/input-group";
import { OptionsGroup } from "../sidebar/groups/options-group";
import { cn, escapeHtml } from "@/lib/utils";
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form";
import { ValidationGroup } from "../sidebar/groups/validation-group";
import { FormLabel } from "@/components/ui/form";

export function FormRadio(component: FormComponentModel, form: UseFormReturn<FieldValues, undefined>, field: ControllerRenderProps) {
  return (
    <RadioGroup
      key={component.id}
      id={component.getField("attributes.id")}
      className={cn(component.getField("attributes.class"))}
      {...field}
    >
      {component.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={`${component.getField("attributes.id")}-${option.value}`}
          />
          <FormLabel htmlFor={`${component.getField("attributes.id")}-${option.value}`} className="font-normal">
            {option.label}
          </FormLabel>
        </div>
      ))}
    </RadioGroup>
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  return {
    code: `
    <RadioGroup
      key="${component.id}"
      id="${escapeHtml(component.getField("attributes.id"))}"
      className="${escapeHtml(component.getField("attributes.class"))}"
      {...field}
    > 
      ${component.options?.map((option) => `
        <div key="${escapeHtml(option.value)}" className="flex items-center space-x-2">
          <RadioGroupItem value="${escapeHtml(option.value)}" id="${escapeHtml(component.getField("attributes.id"))}-${escapeHtml(option.value)}" />
          <FormLabel htmlFor="${escapeHtml(component.getField("attributes.id"))}-${escapeHtml(option.value)}">
            ${escapeHtml(option.label)}
          </FormLabel>  
        </div>
      `).join("\n")}
    </RadioGroup>
    `,
    dependencies: {
      "@/components/ui/radio-group": ["RadioGroup", "RadioGroupItem"],  
      "@/components/ui/form": ["FormLabel"],

    },
  };
}

export const RadioDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: <LabelGroup whitelist={["label", "labelPosition", "labelAlign", "showLabel"]} />,
  input: <InputGroup whitelist={["placeholder", "description", "value"]} />,
  options: <OptionsGroup />,
  button: null,
  validation: <ValidationGroup />,
};
