import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DesignPropertiesViews } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { GridGroup } from "../sidebar/groups/grid-group";
import { LabelGroup } from "../sidebar/groups/label-group";
import { InputGroup } from "../sidebar/groups/input-group";
import { cn, generateTWClassesForAllViewports, escapeHtml } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { ValidationGroup } from "../sidebar/groups/validation-group";
import { FormLabel } from "@/components/ui/form";

export function FormSwitch(component: FormComponentModel, form: UseFormReturn<FieldValues, undefined>, field: ControllerRenderProps) {
  const asCardClasses = generateTWClassesForAllViewports(component, "asCard");

  return (
    <div
      key={component.id}
      className={cn(asCardClasses, "flex justify-between items-center space-x-2 w-full")}
    >
      <div className="grid gap-1.5 leading-none">
        <FormLabel htmlFor={component.getField("attributes.id")}>
          {component.getField("label")}
        </FormLabel>
        <p className="text-sm text-muted-foreground">
          {component.getField("label_description")}
        </p>
      </div>
      <Switch id={component.getField("attributes.id")} {...field} />
    </div>
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  const asCardClasses = generateTWClassesForAllViewports(component, "asCard");
  return {
    code: `
    <div
      key="${component.id}"
      className="${escapeHtml(cn(asCardClasses, "flex justify-between items-center space-x-2 w-full"))}"
    >
      <div className="grid gap-1.5 leading-none">
        <FormLabel htmlFor="${escapeHtml(component.getField("attributes.id"))}">
          ${escapeHtml(component.getField("label"))}
        </FormLabel>
        <p className="text-sm text-muted-foreground">
          ${escapeHtml(component.getField("label_description"))}
        </p>
      </div>
      <Switch id="${escapeHtml(component.getField("attributes.id"))}" {...field} />
    </div>
    `,
    dependencies: {
      "@/components/ui/switch": ["Switch"],
      "@/components/ui/form": ["FormLabel"],

    },
  };
}

export const SwitchDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: <LabelGroup whitelist={["label", "label_description", "labelPosition"]} />,
  input: <InputGroup whitelist={["description", "asCard"]} />,
  options: null,
  button: null,
  validation: <ValidationGroup />,
};
