import { FormComponentModel } from "@/models/FormComponent";
export const generateJsonSchema = (components: FormComponentModel[]) => {
  return {
    components,
    validation: {},
    };
  };
