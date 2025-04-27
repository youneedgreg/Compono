"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from "@/components/sidebar"
import { ComponentPreview } from "@/components/component-preview"
import { CustomizationPanel } from "@/components/customization-panel"
import { CodePanel } from "@/components/code-panel"
import { DevicePreview } from "@/components/device-preview"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen, Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import type { ComponentConfig, DeviceType } from "@/lib/types"
import { defaultComponents } from "@/lib/component-data"
import { AppLoader } from "@/components/app-loader"

export default function ComponentCustomizer() {
  const [selectedComponent, setSelectedComponent] = useState<string>(Object.keys(defaultComponents)[0])
  const [componentConfig, setComponentConfig] = useState<ComponentConfig>(
    defaultComponents[Object.keys
