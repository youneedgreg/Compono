"use client"

import { Search } from "lucide-react"
import type { ComponentData } from "../lib/types"
import { useState } from "react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface SidebarProps {
  components: Record<string, ComponentData>
  selectedComponent: string
  onSelectComponent: (componentId: string) => void
}

export function Sidebar({ components, selectedComponent, onSelectComponent }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Group components by category
  const categories: Record<string, ComponentData[]> = {}
  Object.entries(components).forEach(([id, component]) => {
    if (!categories[component.category]) {
      categories[component.category] = []
    }

    // Only include components that match the search query
    if (
      searchQuery === "" ||
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      categories[component.category].push({
        ...component,
        id,
      })
    }
  })

  return (
    <SidebarProvider>
      <ShadcnSidebar className="border-r h-full">
        <SidebarHeader>
          <form className="px-4 py-2">
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <SidebarInput
                  placeholder="Search components..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form>
        </SidebarHeader>
        <SidebarContent className="overflow-auto">
          {Object.entries(categories).map(
            ([category, categoryComponents]) =>
              categoryComponents.length > 0 && (
                <SidebarGroup key={category}>
                  <SidebarGroupLabel>{category}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {categoryComponents.map((component) => (
                        <SidebarMenuItem key={component.id}>
                          <SidebarMenuButton
                            isActive={selectedComponent === component.id}
                            onClick={() => onSelectComponent(component.id as string)}
                          >
                            {component.name}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ),
          )}
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarProvider>
  )
}
