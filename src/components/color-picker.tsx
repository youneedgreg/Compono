"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [lightness, setLightness] = useState(0)
  const [alpha, setAlpha] = useState(100)
  const [activeTab, setActiveTab] = useState("solid")

  // Parse color on initial load and when color prop changes
  useEffect(() => {
    if (color.startsWith("#")) {
      setActiveTab("hex")
      setLocalColor(color)
    } else if (color.startsWith("hsl")) {
      setActiveTab("hsl")
      // Parse HSL values - simplified for this example
      const match = color.match(/hsla?$$(\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?$$/)
      if (match) {
        setHue(Number.parseInt(match[1]))
        setSaturation(Number.parseInt(match[2]))
        setLightness(Number.parseInt(match[3]))
        setAlpha(match[4] ? Number.parseFloat(match[4]) * 100 : 100)
      }
    }
  }, [color])

  const handleHexChange = (newColor: string) => {
    setLocalColor(newColor)
    onChange(newColor)
  }

  const handleHslChange = () => {
    const newColor = `hsl(${hue}, ${saturation}%, ${lightness}%${alpha < 100 ? `, ${alpha / 100}` : ""})`
    setLocalColor(newColor)
    onChange(newColor)
  }

  // Update HSL values when any slider changes
  useEffect(() => {
    if (activeTab === "hsl") {
      handleHslChange()
    }
  }, [hue, saturation, lightness, alpha, activeTab])

  const presetColors = [
    "#000000",
    "#ffffff",
    "#f44336",
    "#2196f3",
    "#4caf50",
    "#ffeb3b",
    "#ff9800",
    "#9c27b0",
    "#795548",
    "#607d8b",
    "#e91e63",
    "#3f51b5",
    "#009688",
    "#ffc107",
    "#673ab7",
  ]

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-10 p-0 border" style={{ backgroundColor: localColor }}>
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="solid">Presets</TabsTrigger>
              <TabsTrigger value="hex">Hex</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
            </TabsList>

            <TabsContent value="solid" className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((presetColor) => (
                  <Button
                    key={presetColor}
                    variant="outline"
                    className="w-10 h-10 p-0 border rounded-md"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handleHexChange(presetColor)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hex" className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={localColor}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-12 h-8 p-0"
                />
                <Input value={localColor} onChange={(e) => handleHexChange(e.target.value)} className="flex-1" />
              </div>
            </TabsContent>

            <TabsContent value="hsl" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Hue: {hue}°</Label>
                  </div>
                  <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={[hue]}
                    onValueChange={([value]) => setHue(value)}
                    className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-[#ff0000] [&>span:first-child]:via-[#00ff00] [&>span:first-child]:to-[#0000ff]"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Saturation: {saturation}%</Label>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[saturation]}
                    onValueChange={([value]) => setSaturation(value)}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Lightness: {lightness}%</Label>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[lightness]}
                    onValueChange={([value]) => setLightness(value)}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Alpha: {alpha}%</Label>
                  </div>
                  <Slider min={0} max={100} step={1} value={[alpha]} onValueChange={([value]) => setAlpha(value)} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between mt-4">
            <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: localColor }}></div>
            <div className="text-sm">{localColor}</div>
          </div>
        </PopoverContent>
      </Popover>
      <Input value={localColor} onChange={(e) => handleHexChange(e.target.value)} className="flex-1" />
    </div>
  )
}
