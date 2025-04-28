"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from "@/components/sidebar"
import { ComponentPreview } from "../components/component-preview"
import { CustomizationPanel } from "@/components/customization-panel"
import { CodePanel } from "@/components/code-panel"
import { DevicePreview } from "@/components/device-preview"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type { ComponentConfig, DeviceType } from "@/lib/types"
import { defaultComponents } from "@/lib/component-data"
import { AppLoader } from "@/components/app-loader"

export default function ComponentCustomizer() {
  const [selectedComponent, setSelectedComponent] = useState<string>(Object.keys(defaultComponents)[0])
  const [componentConfig, setComponentConfig] = useState<ComponentConfig>(
    defaultComponents[Object.keys(defaultComponents)[0]],
  )
  const [activeDevice, setActiveDevice] = useState<DeviceType>("desktop")
  const [activeTab, setActiveTab] = useState<string>("customize")
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()

  const handleComponentSelect = (componentId: string) => {
    setIsLoading(true)
    // Simulate a short loading delay
    setTimeout(() => {
      setSelectedComponent(componentId)
      setComponentConfig(defaultComponents[componentId])
      setIsLoading(false)
    }, 500)
  }

  const handleConfigChange = (newConfig: ComponentConfig) => {
    setComponentConfig(newConfig)
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <AppLogo className="h-8 w-8" />
            <h1 className="text-xl font-bold">Compono</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {sidebarVisible && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="relative">
                <Sidebar
                  components={defaultComponents}
                  selectedComponent={selectedComponent}
                  onSelectComponent={handleComponentSelect}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="absolute right-0 top-4 z-10 m-2 bg-background shadow-sm border"
                >
                  <PanelLeftClose className="h-4 w-4" />
                  <span className="sr-only">Hide sidebar</span>
                </Button>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          <ResizablePanel defaultSize={sidebarVisible ? 80 : 100}>
            <div className="h-full relative">
              {!sidebarVisible && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="absolute left-0 top-4 z-10 m-2 bg-background shadow-sm border"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                  <span className="sr-only">Show sidebar</span>
                </Button>
              )}
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <AppLoader />
                </div>
              ) : (
                <MainContent
                  componentConfig={componentConfig}
                  activeDevice={activeDevice}
                  setActiveDevice={setActiveDevice}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  handleConfigChange={handleConfigChange}
                />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

// Extract the main content into a separate component for reuse
function MainContent({
  componentConfig,
  activeDevice,
  setActiveDevice,
  activeTab,
  setActiveTab,
  handleConfigChange,
}: {
  componentConfig: ComponentConfig
  activeDevice: DeviceType
  setActiveDevice: (device: DeviceType) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  handleConfigChange: (newConfig: ComponentConfig) => void
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={65} minSize={40} maxSize={80}>
        <div className="h-full flex flex-col">
          <DevicePreview activeDevice={activeDevice} onDeviceChange={setActiveDevice} />
          <div className="flex-1 overflow-auto">
            <ComponentPreview componentConfig={componentConfig} deviceType={activeDevice} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={35} minSize={20}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList className="my-2">
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-auto">
            <TabsContent value="customize" className="h-full m-0">
              <CustomizationPanel componentConfig={componentConfig} onConfigChange={handleConfigChange} />
            </TabsContent>
            <TabsContent value="code" className="h-full m-0">
              <CodePanel componentConfig={componentConfig} />
            </TabsContent>
          </div>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

// App logo component
function AppLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 2H9a1 1 0 0 0-1 1v19l4-2 4 2V3a1 1 0 0 0-1-1Z" />
      <path d="M6 9H2v11a1 1 0 0 0 1 1h3V9Z" />
      <path d="M22 9h-4v12h3a1 1 0 0 0 1-1V9Z" />
    </svg>
  )
}
