import { DndContext, DragOverlay, closestCenter, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface CardComponent {
  id: string;
  title: string;
  description: string;
  content: string;
  footer: string;
  variant: "default" | "outline";
}

export function CardBuilder() {
  const [cards, setCards] = useState<CardComponent[]>([]);
  const [draggingCard, setDraggingCard] = useState<CardComponent | null>(null);

  const handleAddCard = useCallback(() => {
    const newCard: CardComponent = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Card",
      description: "Add a description",
      content: "Add content here",
      footer: "Card footer",
      variant: "default",
    };
    setCards((prev) => [...prev, newCard]);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      setDraggingCard(card);
    }
  }, [cards]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = cards.findIndex(card => card.id === active.id);
    const newIndex = cards.findIndex(card => card.id === over.id);

    if (oldIndex !== newIndex) {
      const newCards = [...cards];
      const [movedCard] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedCard);
      setCards(newCards);
    }

    setDraggingCard(null);
  }, [cards]);

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Card Builder</h1>
            <Button variant="outline" onClick={handleAddCard}>
              Add Card
            </Button>
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <SortableCard key={card.id} card={card} onEdit={() => {}} />
              ))}
            </div>
            <DragOverlay>
              {draggingCard ? (
                <Card className="w-full h-48 opacity-50">
                  <div className="p-4">
                    <h3 className="font-semibold">{draggingCard.title}</h3>
                    <p className="text-sm text-muted-foreground">{draggingCard.description}</p>
                  </div>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </SidebarProvider>
    </div>
  );
}

function SortableCard({ card, onEdit }: { card: CardComponent; onEdit: (card: CardComponent) => void }) {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-pointer transition-all",
        isDragging && "ring-2 ring-primary"
      )}
      onClick={() => onEdit(card)}
    >
      <div className="p-4">
        <h3 className="font-semibold">{card.title}</h3>
        <p className="text-sm text-muted-foreground">{card.description}</p>
        <p className="mt-2">{card.content}</p>
        <p className="text-sm text-muted-foreground mt-4">{card.footer}</p>
      </div>
    </Card>
  );
} 