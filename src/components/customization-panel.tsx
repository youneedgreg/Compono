"use client"

import type { ComponentConfig, PropertyConfig } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColorPicker } from "@/components/color-picker"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { TemplateSelector } from "@/components/template-selector"
import { applyTemplate } from "@/lib/component-templates"

interface CustomizationPanelProps {
  componentConfig: ComponentConfig
  onConfigChange: (newConfig: ComponentConfig) => void
}

export function CustomizationPanel({ componentConfig, onConfigChange }: CustomizationPanelProps) {
  const [localConfig, setLocalConfig] = useState<ComponentConfig>(componentConfig)
  const [isApplying, setIsApplying] = useState(false)

  // Update local config when component changes
  useEffect(() => {
    setLocalConfig(componentConfig)
  }, [componentConfig])

  const handlePropertyChange = (propertyId: string, value: any) => {
    const newConfig = {
      ...localConfig,
      properties: {
        ...localConfig.properties,
        [propertyId]: {
          ...localConfig.properties[propertyId],
          value,
        },
      },
    }

    setLocalConfig(newConfig)
  }

  const handleApplyChanges = () => {
    setIsApplying(true)
    // Simulate a short delay to show the loader
    setTimeout(() => {
      onConfigChange(localConfig)
      setIsApplying(false)
    }, 500)
  }

  const handleResetChanges = () => {
    setLocalConfig(componentConfig)
  }

  const handleSelectTemplate = (templateName: string) => {
    setIsApplying(true)
    // Simulate a short delay to show the loader
    setTimeout(() => {
      const newConfig = applyTemplate(localConfig, templateName)
      setLocalConfig(newConfig)
      onConfigChange(newConfig)
      setIsApplying(false)
    }, 500)
  }

  const renderPropertyControl = (propertyId: string, property: PropertyConfig) => {
    switch (property.type) {
      case "string":
        return (
          <Input value={property.value as string} onChange={(e) => handlePropertyChange(propertyId, e.target.value)} />
        )
      case "number":
        return (
          <Input
            type="number"
            value={property.value as number}
            onChange={(e) => handlePropertyChange(propertyId, Number.parseFloat(e.target.value))}
          />
        )
      case "boolean":
        return (
          <Switch
            checked={property.value as boolean}
            onCheckedChange={(checked) => handlePropertyChange(propertyId, checked)}
          />
        )
      case "select":
        return (
          <Select value={property.value as string} onValueChange={(value) => handlePropertyChange(propertyId, value)}>
            <SelectTrigger>
              <SelectValue placeholder={property.placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "color":
        return (
          <ColorPicker color={property.value as string} onChange={(color) => handlePropertyChange(propertyId, color)} />
        )
      case "range":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Slider
                min={property.min || 0}
                max={property.max || 100}
                step={property.step || 1}
                value={[property.value as number]}
                onValueChange={([value]) => handlePropertyChange(propertyId, value)}
                className="flex-1 mr-2"
              />
              <Input
                type="number"
                value={property.value as number}
                onChange={(e) => handlePropertyChange(propertyId, Number(e.target.value))}
                className="w-16"
              />
            </div>
          </div>
        )
      default:
        return <div>Unsupported property type</div>
    }
  }

  // Group properties by category
  const propertyCategories: Record<string, Record<string, PropertyConfig>> = {}

  // Define the order of categories
  const categoryOrder = ["Content", "Appearance", "Dimensions", "Colors", "Layout", "State", "Behavior", "General"]

  // First, collect all categories from properties
  Object.entries(localConfig.properties).forEach(([propertyId, property]) => {
    const category = property.category || "General"
    if (!propertyCategories[category]) {
      propertyCategories[category] = {}
    }
    propertyCategories[category][propertyId] = property
  })

  // Sort categories according to the defined order
  const sortedCategories = Object.keys(propertyCategories).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)

    // If both categories are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only one category is in the order list, prioritize it
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    // If neither category is in the order list, sort alphabetically
    return a.localeCompare(b)
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{componentConfig.name}</h3>
          <div className="flex items-center gap-2">
            <TemplateSelector componentId={componentConfig.id} onSelectTemplate={handleSelectTemplate} />
            <Button size="sm" variant="ghost" onClick={handleResetChanges} disabled={isApplying}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyChanges} disabled={isApplying}>
              {isApplying ? <ComponentLoader className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Apply
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <Accordion type="multiple" defaultValue={sortedCategories}>
          {sortedCategories.map((category) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {Object.entries(propertyCategories[category]).map(([propertyId, property]) => (
                    <div key={propertyId} className="grid gap-2">
                      <Label htmlFor={propertyId}>{property.label}</Label>
                      {property.description && (
                        <p className="text-xs text-muted-foreground mb-1">{property.description}</p>
                      )}
                      {renderPropertyControl(propertyId, property)}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )
}

// Custom loader component that fits with the app's branding
function ComponentLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-block animate-spin ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}
