"use client";

import {
  EyeIcon,
  Monitor,
  Tablet,
  Smartphone,
  BlocksIcon,
  CodeIcon,
  PlayIcon,
  XIcon,
  ExternalLink,
} from "lucide-react";
import { PencilRulerIcon } from "lucide-react";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { Button } from "@/components/ui/button";
import { ToggleGroupNav } from "@/components/form-builder/ui/toggle-group-nav";
import { useMemo, useState } from "react";
import {
  DependenciesImports,
  generateFormCode,
} from "@/components/form-builder/helpers/generate-react-code";
import { GenerateCodeDialog } from "@/components/form-builder/dialogs/generate-code-dialog";
import { MobileNotification } from "@/components/form-builder/ui/mobile-notification";
import { useIsMobile } from "@/hooks/use-mobile";
import SocialLinks from "@/components/form-builder/sidebar/socialLinks";
import { OpenJsonDialog } from "@/components/form-builder/dialogs/open-json-dialog";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "@/components/form-builder/form-components/wysiwyg/editor-toolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentBuilder } from "@/components/form-builder/builders/component-builder";

export default function FormBuilderPage() {
  const isMobile = useIsMobile();
  // Split the store selectors to only subscribe to what we need
  const viewport = useFormBuilderStore((state) => state.viewport);
  const mode = useFormBuilderStore((state) => state.mode);
  const showJson = useFormBuilderStore((state) => state.showJson);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const componentType = useFormBuilderStore((state) => state.componentType);
  const updateViewport = useFormBuilderStore((state) => state.updateViewport);
  const updateMode = useFormBuilderStore((state) => state.updateMode);
  const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle);
  const updateComponentType = useFormBuilderStore((state) => state.updateComponentType);
  const toggleJsonPreview = useFormBuilderStore(
    (state) => state.toggleJsonPreview
  );
  const components = useFormBuilderStore((state) => state.components);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const editor = useFormBuilderStore((state) => state.editor);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{
    code: string;
    dependenciesImports: DependenciesImports;
  }>({ code: "", dependenciesImports: {} });
  const form = useForm();

  // Memoize static values
  const viewportItems = useMemo(
    () => [
      { value: "lg", icon: Monitor },
      { value: "md", icon: Tablet },
      { value: "sm", icon: Smartphone },
    ],
    []
  );

  const modeItems = useMemo(
    () => [
      { value: "editor", icon: PencilRulerIcon },
      { value: "preview", icon: EyeIcon },
    ],
    []
  );

  const handleGenerateCode = async () => {
    const generatedCode = await generateFormCode(components);
    setGeneratedCode(generatedCode);
    setShowCodeDialog(true);
  };

  return (
    <div>
      <div className={cn("fixed top-0 w-full flex flex-row gap-2 justify-between bg-white border-b z-30")}>
        <div className="flex flex-row gap-2 items-center justify-center md:justify-start p-2 px-4 border-r w-full md:w-[300px]">
          <BlocksIcon className="h-6 w-6" strokeWidth={2} />
          <h2 className="text-lg font-semibold">
            shadcn/ui <span className="font-normal">Builder</span>
            <sup className="text-xs text-muted-foreground font-normal ml-1">
              Beta
            </sup>
          </h2>
        </div>
        <div className="p-2 flex-1 grid grid-cols-7 2xl:grid-cols-3">
          {mode === "editor" && (
            <>
              <div
                className={cn(
                  "hidden 2xl:block col-span-1",
                  editor && "2xl:hidden"
                )}
              >
                {process.env.NODE_ENV === "development" && <OpenJsonDialog />}
              </div>
              <div className="col-span-5 2xl:col-span-1 2xl:col-start-2 flex 2xl:justify-center gap-4">
                <Select value={componentType} onValueChange={updateComponentType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select component type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form">Form Builder</SelectItem>
                    <SelectItem value="sidebar">Sidebar Builder</SelectItem>
                    <SelectItem value="button">Button Builder</SelectItem>
                    <SelectItem value="card">Card Builder</SelectItem>
                    <SelectItem value="dialog">Dialog Builder</SelectItem>
                    <SelectItem value="dropdown">Dropdown Builder</SelectItem>
                    <SelectItem value="table">Table Builder</SelectItem>
                  </SelectContent>
                </Select>
                {editor ? (
                  <EditorToolbar editor={editor} isEditable={true} />
                ) : (
                  <div className="text-center flex flex-row items-center justify-center gap-1 border rounded-md h-9 px-4">
                    <div
                      className="max-w-80 overflow-y-hidden whitespace-nowrap text-sm outline-none scrollbar-hide"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateFormTitle(e.target.innerText)}
                    >
                      {formTitle}
                    </div>
                    <span className="text-muted-foreground text-xs">.tsx</span>
                  </div>
                )}
              </div>
            </>
          )}
          <div
            className={cn(
              "col-span-2 2xl:col-span-1 hidden md:flex justify-end gap-4",
              editor && "",
              mode === "preview" && "justify-center col-span-7 2xl:col-span-3"
            )}
          >
            {process.env.NODE_ENV === "development" && mode === "editor" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleJsonPreview}
                className={showJson ? "bg-slate-100" : ""}
              >
                <CodeIcon className="h-4 w-4" />
              </Button>
            )}
            <ToggleGroupNav
              name="viewport"
              items={viewportItems}
              defaultValue={viewport}
              onValueChange={(value) =>
                updateViewport(value as "sm" | "md" | "lg")
              }
            />
          </div>
        </div>
        <div className="hidden md:flex flex-row gap-2 border-l py-2 px-4 w-[300px]">
          {mode === "editor" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer flex-1"
                onClick={() => {updateMode("preview"); selectComponent(null)}}
              >
                <PlayIcon className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="default"
                size="sm"
                className="cursor-pointer flex-1"
                onClick={handleGenerateCode}
                disabled={components.length === 0}
                id="export-code-button"
              >
                <ExternalLink className="h-4 w-4" />
                Export
              </Button>
            </>
          )}
          {mode === "preview" && (
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer w-full"
              onClick={() => updateMode("editor")}
            >
              <XIcon className="h-4 w-4" />
              Exit Preview
            </Button>
          )}
        </div>
      </div>

      {isMobile ? (
        <>
          <MobileNotification />
          <div className="fixed bottom-0 w-full p-4 border-t">
            <SocialLinks />
          </div>
        </>
      ) : (
        <>
          <ComponentBuilder />
          <GenerateCodeDialog
            open={showCodeDialog}
            onOpenChange={setShowCodeDialog}
            generatedCode={generatedCode}
          />
        </>
      )}
    </div>
  );
}
