import { useFormBuilderStore } from "@/stores/form-builder-store";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type propertiesWhitelist = "type" | "content" | "variant";

export type ButtonGroupProps = {
  whitelist?: propertiesWhitelist[];
};

export function ButtonGroup({
  whitelist = ["type", "content", "variant"],
}: ButtonGroupProps) {
  const { updateComponent, selectedComponent } = useFormBuilderStore();

  if (!selectedComponent) {
    return null;
  }

  let defaultInputType = selectedComponent.getField("attributes.type");
  let defaultInputContent = selectedComponent.getField("content");
  let defaultValueVariant =
    selectedComponent.getField("properties.variant") || "default";

  const handleChange = (
    field: string,
    value: any,
    isValidForAllViewports: boolean = false
  ) => {
    updateComponent(selectedComponent.id, field, value, isValidForAllViewports);
  };

  const handleChangeVariant = (field: string, value: any) => {
    updateComponent(selectedComponent.id, field, value);
  };

  return (
    <>
      {whitelist.includes("content") && (
        <div className="grid grid-cols-2 gap-2 items-center">
          <Label className="text-xs text-gray-400">Content</Label>
          <div className="flex flex-row items-center gap-2">
            <Input
              value={defaultInputContent}
              onChange={(e) => handleChange("content", e.target.value, true)}
            />
          </div>
        </div>
      )}
      {whitelist.includes("type") && (
        <div className="grid grid-cols-2 gap-2 items-center">
          <Label className="text-xs text-gray-400">Type</Label>
          <div className="flex flex-row items-center gap-2">
            <Select
              value={defaultInputType}
              onValueChange={(value) =>
                handleChange("attributes.type", value, true)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="submit">Submit</SelectItem>
                <SelectItem value="reset">Reset</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {whitelist.includes("variant") && (
        <div className="grid grid-cols-2 gap-2 items-center">
          <Label className="text-xs text-gray-400 flex-1 inline-block">
            Variant
        </Label>
        <div className="flex flex-row items-center gap-2">
          <Select
            value={defaultValueVariant}
            onValueChange={(value) =>
              handleChangeVariant("properties.variant", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
}
