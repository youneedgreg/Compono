import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { MainCanvas } from "../mainCanvas";
import { SidebarLeft } from "../sidebar/sidebarLeft";
import { SidebarRight } from "../sidebar/sidebarRight";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { DragStartEvent } from "@dnd-kit/core";
import { PointerSensor, useSensor } from "@dnd-kit/core";
import { getGridRows, updateColSpans } from "@/lib/utils";

export function FormBuilder() {
  const mode = useFormBuilderStore((state) => state.mode);
  const components = useFormBuilderStore((state) => state.components);
  const viewport = useFormBuilderStore((state) => state.viewport);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const updateComponent = useFormBuilderStore((state) => state.updateComponent);
  const moveComponent = useFormBuilderStore((state) => state.moveComponent);
  const addComponent = useFormBuilderStore((state) => state.addComponent);
  const [draggingDOMElement, setDraggingDOMElement] = useState<HTMLElement | null>(null);

  // Create sensors outside of callback
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 20,
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const action: "move" | "add" = active.data.current.action;
    let activeComponent = active.data.current.component;
    const overComponent = over.data.current.component;
    const position = over.data.current.position;
    const activeIndex = active.data.current.index;
    const overIndex = over.data.current.index;

    if (action === "add") {
      activeComponent = addComponent(active.data.current.component);
    }

    if (
      (activeIndex === overIndex &&
        (position === "left" || position === "right")) ||
      // Or the diff between active and over is 1
      (activeIndex - overIndex === 1 && position === "bottom") ||
      (overIndex - activeIndex === 1 && position === "top")
    ) {
      return;
    }

    if (activeComponent && overComponent) {
      const gridRows = getGridRows(components, viewport);
      const overRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === over.data.current?.component.id)
        ) || [];

      const overRowFirstItemIndex = components.findIndex(
        (component) => component.id === overRowItems[0].id
      );

      const overRowLastItemIndex = components.findIndex(
        (component) => component.id === overRowItems[overRowItems.length - 1].id
      );

      let activeRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === active.data.current?.component.id)
        ) || [];

      const draggingInSameRow = overRowItems === activeRowItems;

      // Don´t update the spans if the component is being dragged in the same row
      activeRowItems = activeRowItems.filter(
        (item) => item.id !== activeComponent.id
      );
      let updatedOverItems = [];

      if (position === "top" || position === "bottom") {
        updatedOverItems = updateColSpans([activeComponent]);
      } else {
        updatedOverItems = updateColSpans([...overRowItems, activeComponent]);
      }

      if (
        (!draggingInSameRow && (position === "left" || position === "right")) ||
        position === "top" ||
        position === "bottom"
      ) {
        updatedOverItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false
          );
        });

        const updatedActiveItems = updateColSpans([...activeRowItems]);

        updatedActiveItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false
          );
        });
      }

      const oldIndex = active.data.current.index;
      let newIndex =
        position === "left"
          ? overIndex
          : activeIndex < overIndex
            ? overIndex
            : overIndex + 1;

      if (position === "top") {
        newIndex =
          activeIndex < overIndex
            ? overRowFirstItemIndex - 1
            : overRowFirstItemIndex;
      }

      if (position === "bottom") {
        newIndex =
          activeIndex < overIndex
            ? overRowLastItemIndex
            : overRowLastItemIndex + 1;
      }

      moveComponent(oldIndex, newIndex);
    }
  };

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      selectComponent(null);
      const element = document.querySelector(
        `[data-item-id="${event.active.data.current?.component.id}"]`
      );
      if (element) {
        setDraggingDOMElement(element as HTMLElement);
      }
    },
    [selectComponent]
  );

  return (
    <SidebarProvider
      className="relative hidden md:block"
      style={{ "--sidebar-width": "300px" } as React.CSSProperties}
      open={mode === "editor"}
    >
      <DndContext
        id="form-builder"
        sensors={[pointerSensor]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="flex w-full h-screen justify-between">
          <SidebarLeft />
          <main className={cn("flex-1 transition-all duration-300 overflow-auto relative bg-dotted pt-14 scrollbar-hide", mode === "preview" && "bg-slate-50")}>
            <MainCanvas />
          </main>
          <SidebarRight />
        </div>
        <DragOverlay>
          {draggingDOMElement && (
            <div className="bg-white p-2 rounded-md shadow opacity-80">
              <div
                dangerouslySetInnerHTML={{
                  __html: draggingDOMElement.innerHTML,
                }}
                className="max-h-52 overflow-hidden"
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </SidebarProvider>
  );
} 