"use client"

import { useState } from "react"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { componentTemplates } from "@/lib/component-templates"

interface TemplateSelectorProps {
  componentId: string
  onSelectTemplate: (templateName: string) => void
}

export function TemplateSelector({ componentId, onSelectTemplate }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)

  // Get templates for this component type
  const templates = componentTemplates[componentId] || {}
  const templateNames = Object.keys(templates)

  if (templateNames.length === 0) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Templates</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="bottom" sideOffset={4}>
        <Command>
          <CommandInput placeholder="Search templates..." />
          <CommandList>
            <CommandEmpty>No templates found.</CommandEmpty>
            <CommandGroup>
              {templateNames.map((templateName) => (
                <CommandItem
                  key={templateName}
                  onSelect={() => {
                    onSelectTemplate(templateName)
                    setOpen(false)
                  }}
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  {templateName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
