"use client";

import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useMemo, memo } from "react";
import GenerateCanvasGrid from "./canvas/generate-canvas-grid";
import { Pre } from "@/components/ui/pre";
import { generateJsonSchema } from "./helpers/generate-json";
import { cn } from "@/lib/utils";
import { CardContent } from "../ui/card";
import { Card } from "../ui/card";
import { FormComponentModel } from "@/models/FormComponent";
// Memoize static viewport styles
const viewportEditorStyles = {
  sm: "w-[370px]",
  md: "w-[818px]",
  lg: "w-[1074px]",
} as const;

// Memoize the JSON preview component
const JsonPreview = memo(({ components }: { components: FormComponentModel[] }) => {
  const jsonString = useMemo(
    () => JSON.stringify(generateJsonSchema(components), null, 2),
    [components]
  );

  return (
    <div className={`h-full overflow-scroll w-full`}>
      <Pre language="json" code={jsonString} />
    </div>
  );
});

JsonPreview.displayName = "JsonPreview";

export function MainCanvas() {
  // Split store selectors to minimize re-renders
  const viewport = useFormBuilderStore((state) => state.viewport);
  const showJson = useFormBuilderStore((state) => state.showJson);
  const selectedComponent = useFormBuilderStore(
    (state) => state.selectedComponent
  );
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const components = useFormBuilderStore((state) => state.components);

  return (
    <div className="flex gap-4 h-full flex-col 3xl:flex-row">
      <div
        className={`h-full w-full`}
        onClick={() => {
          if (selectedComponent) {
            selectComponent(null);
          }
        }}
      >
        <Card
          className={cn(
            'transition-all duration-300',
            `${viewportEditorStyles[viewport]}`,
            "mx-auto scrollbar-hide mt-6"
          )}
        >
          <CardContent>
            <GenerateCanvasGrid />
          </CardContent>
        </Card>
        
      </div>
      {showJson && <JsonPreview components={components} />}
    </div>
  );
}
