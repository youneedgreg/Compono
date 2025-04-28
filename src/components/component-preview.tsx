"use client"

import type { ComponentConfig, DeviceType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { renderComponent } from "@/lib/component-renderer"

interface ComponentPreviewProps {
  componentConfig: ComponentConfig
  deviceType: DeviceType
}

export function ComponentPreview({ componentConfig, deviceType }: ComponentPreviewProps) {
  const deviceWidths: Record<DeviceType, string> = {
    mobile: "w-full max-w-[375px]",
    tablet: "w-full max-w-[768px]",
    desktop: "w-full max-w-[1280px]",
  }

  return (
    <div className="flex justify-center h-full pt-8">
      <div className={cn("border rounded-lg p-6 bg-background self-start", deviceWidths[deviceType])}>
        {renderComponent(componentConfig)}
      </div>
    </div>
  )
}
