import { useFormBuilderStore } from "@/stores/form-builder-store";
import { FormBuilder } from "./form-builder";
import { CardBuilder } from "./card-builder";

export function ComponentBuilder() {
  const componentType = useFormBuilderStore((state) => state.componentType);

  switch (componentType) {
    case "form":
      return <FormBuilder />;
    case "card":
      return <CardBuilder />;
    case "sidebar":
    case "button":
    case "dialog":
    case "dropdown":
    case "table":
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">
            {componentType.charAt(0).toUpperCase() + componentType.slice(1)} Builder coming soon...
          </p>
        </div>
      );
    default:
      return null;
  }
} 