"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn, escapeHtml } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DesignPropertiesViews } from "@/types/form-builder.types"
import { GridGroup } from "../sidebar/groups/grid-group"
import { HtmlGroup } from "../sidebar/groups/html-group"
import { LabelGroup } from "../sidebar/groups/label-group"
import { InputGroup } from "../sidebar/groups/input-group"    
import { FormComponentModel } from "@/models/FormComponent"
import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form"
import { ValidationGroup } from "../sidebar/groups/validation-group"

export function FormDatePicker(component: FormComponentModel, form: UseFormReturn<FieldValues, undefined>, field: ControllerRenderProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-full",
            !field.value && "text-muted-foreground",
            component.getField("attributes.class")
          )}
          id={component.getField("attributes.id")}
          {...field}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : <span className="text-muted-foreground">{component.getField("attributes.placeholder")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          initialFocus
          selected={field.value}
          onSelect={field.onChange}
        />
      </PopoverContent>
    </Popover>
  )
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  return {
    code: `
      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="${escapeHtml(cn(
            "justify-start text-left font-normal w-full",
            component.getField("attributes.class")
          ))}"
          id="${escapeHtml(component.getField("attributes.id"))}"
          name="${escapeHtml(component.getField("attributes.name"))}"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : <span className="text-muted-foreground">${escapeHtml(component.getField("attributes.placeholder"))}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single" 
          initialFocus
          onSelect={field.onChange}
        />
      </PopoverContent>
    </Popover>
    `,
    dependencies: {
      "@/components/ui/button": ["Button"], 
      "@/components/ui/calendar": ["Calendar"],
      "@/components/ui/popover": ["Popover", "PopoverContent", "PopoverTrigger"],

      "date-fns": ["format"],
      "lucide-react": ["CalendarIcon"],
    },    
  };
}


export const DatePickerDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: <LabelGroup whitelist={["label", "labelPosition", "labelAlign", "showLabel"]} />,
  input: <InputGroup whitelist={["placeholder", "description"]} />,
  options: null,
  button: null,
  validation: <ValidationGroup />,
};
