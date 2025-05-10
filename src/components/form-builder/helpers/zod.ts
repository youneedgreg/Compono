import { FormComponentModel } from "@/models/FormComponent";
import { FormComponentValidationTypes } from "@/types/FormComponent.types";
import { z } from "zod";

export const shouldForceRequired = (
  validations: FormComponentValidationTypes
): boolean => {
  if (!validations) return false;

  // If required is explicitly set to "no", check for min/max validations
  if (validations.required === "no") {
    return (
      validations.min !== undefined &&
      validations.min !== 0 &&
      validations.min !== "" &&
      validations.max !== undefined &&
      validations.max !== 0 &&
      validations.max !== "" &&
      validations.minLength !== undefined &&
      validations.minLength !== 0 &&
      validations.maxLength !== undefined &&
      validations.maxLength !== 0
    );
  }

  return validations.required === "yes";
};

const createNumberSchema = (
  validations: FormComponentValidationTypes,
  isRequired: boolean
): z.ZodType => {
  if (!isRequired) {
    return z.coerce.number().optional();
  }

  let schema = z.coerce.number({
    invalid_type_error: "This field must be a number",
  }).min(1, { message: "This field is required" });

  if (validations.min !== undefined && validations.min !== "") {
    schema = schema.min(Number(validations.min), {
      message: `Must be at least ${validations.min}`,
    });
  }

  if (validations.max !== undefined && validations.max !== "") {
    schema = schema.max(Number(validations.max), {
      message: `Must be at most ${validations.max}`,
    });
  }

  return schema;
};

const createStringSchema = (
  validations: FormComponentValidationTypes,
  isRequired: boolean
): z.ZodType => {

  if (!isRequired) {
    return z.string().optional();
  }

  let schema = z.string();
  
  if (isRequired) {
    schema = schema.min(1, { message: "This field is required" });
  }

  // Validate min and max length
  if (validations.minLength !== undefined && validations.minLength !== "") {
    schema = schema.min(Number(validations.minLength), {
      message: `Must be at least ${validations.minLength} characters`,
    });
  }
  
  if (validations.maxLength !== undefined && validations.maxLength !== "") {
    schema = schema.max(Number(validations.maxLength), {
      message: `Must be at most ${validations.maxLength} characters`,
    });
  }

  return schema;
};

const createDateSchema = (
  validations: FormComponentValidationTypes,
  isRequired: boolean
): z.ZodType => {

  if (!isRequired) {
    return z.date().optional();
  }

  return z.date({
    required_error: "This field is required.",
  });
};

const createSchemaForComponent = (
  component: FormComponentModel,
  validations: FormComponentValidationTypes,
  isRequired: boolean,
  asString?: boolean
): z.ZodType | string => {
  if (component.type === "number") {
    return asString ? createNumberSchemaAsString(validations, isRequired) : createNumberSchema(validations, isRequired);
  }

  if (component.type === "date") {
    return asString ? createDateSchemaAsString(validations, isRequired) : createDateSchema(validations, isRequired);
  }
  
  return asString ? createStringSchemaAsString(validations, isRequired) : createStringSchema(validations, isRequired);
};

export const getZodSchemaForComponents = (components: FormComponentModel[], asString: boolean = false) => {
  const schema: Record<string, z.ZodSchema | string> = {};

  components.forEach((component) => {
    const validations = component.getField("validations");
    const isRequired = shouldForceRequired(validations);
    const componentId = component.getField("attributes.id");
  
    schema[componentId] = createSchemaForComponent(component, validations, isRequired, asString);
  });

  if (asString) {
    const stringSchema = Object.entries(schema).map(([key, value]) => {
      return `"${key}": ${value}`;
    }).join(",\n");

    return `z.object({${stringSchema}})`;
  }

  return z.object(schema as Record<string, z.ZodType>);
};

const createNumberSchemaAsString = (
  validations: FormComponentValidationTypes,
  isRequired: boolean
): string => {
  
  if (!isRequired) {
    return `z.coerce.number().optional()`;
  }

  let schema = `z.coerce.number({
    invalid_type_error: "This field must be a number",
  }).min(1, { message: "This field is required" })`;

  if (validations.min !== undefined && validations.min !== "") {
    schema += `.min(${validations.min}, { message: "Must be at least ${validations.min}" })`;
  }

  if (validations.max !== undefined && validations.max !== "") {
    schema += `.max(${validations.max}, { message: "Must be at most ${validations.max}" })`;
  }

  return schema;
};

const createDateSchemaAsString = (
  validations: FormComponentValidationTypes,
  isRequired: boolean
): string => {
  if (!isRequired) {
    return `z.date().optional()`;
  }

  return `z.date({
    required_error: "This field is required.",
  })`;
};

const createStringSchemaAsString = (
  validations: FormComponentValidationTypes,
  isRequired: boolean
): string => {
  if (!isRequired) {
    return `z.string().optional()`;
  }

  let schema = `z.string().min(1, { message: "This field is required" })`;
  
  if (validations.minLength !== undefined && validations.minLength !== "") {
    schema += `.min(${validations.minLength}, { message: "Must be at least ${validations.minLength} characters" })`;
  }

  if (validations.maxLength !== undefined && validations.maxLength !== "") {
    schema += `.max(${validations.maxLength}, { message: "Must be at most ${validations.maxLength} characters" })`;
  }

  return schema;
};

export const getZodDefaultValues = (
  components: FormComponentModel[]
): Record<string, string | number | undefined> => {
  const defaultValues: Record<string, string | number | undefined> = {};

  components.forEach((component) => {
    const componentId = component.getField("attributes.id");

    let defaultValue = component.getField("value") || undefined;

    if (component.type === "number") {
      defaultValue = new Number(defaultValue);
    }

    defaultValues[componentId] = defaultValue;
  });

  return defaultValues;
};


export const getZodDefaultValuesAsString = (components: FormComponentModel[]) => {
  const defaultValues = getZodDefaultValues(components);
  return Object.entries(defaultValues).map(([key, value]) => {
    return `"${key}": ${typeof value === "string" ? `"${value}"` : value}`;
  }).join(",\n");
};

