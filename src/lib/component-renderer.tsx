import type React from "react"
import type { ComponentConfig } from "./types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"

export function renderComponent(config: ComponentConfig) {
  switch (config.id) {
    case "button":
      return renderButton(config)
    case "card":
      return renderCard(config)
    case "alert":
      return renderAlert(config)
    case "input":
      return renderInput(config)
    case "dropdown":
      return renderDropdown(config)
    case "tabs":
      return renderTabs(config)
    default:
      return <div>Component not found</div>
  }
}

function renderButton(config: ComponentConfig) {
  const { variant, size, disabled, text, width, height, paddingX, paddingY, borderWidth, borderRadius } =
    config.properties

  // Create custom styles based on properties
  const customStyles: React.CSSProperties = {
    borderRadius: `${borderRadius.value}px`,
  }

  // Only apply these styles for certain variants or when values are non-zero
  if (variant.value === "default" || variant.value === "destructive") {
    customStyles.backgroundColor = config.properties.backgroundColor.value as string
    customStyles.color = config.properties.textColor.value as string
  }

  if (variant.value === "outline") {
    customStyles.borderColor = config.properties.borderColor.value as string
    if (borderWidth.value !== 1) {
      customStyles.borderWidth = `${borderWidth.value}px`
    }
  }

  // Apply custom dimensions if specified
  if (width.value > 0) {
    customStyles.width = `${width.value}px`
  }

  if (height.value > 0) {
    customStyles.height = `${height.value}px`
  }

  // Apply custom padding if specified
  if (paddingX.value > 0 || paddingY.value > 0) {
    customStyles.padding = `${paddingY.value > 0 ? paddingY.value : 0}px ${paddingX.value > 0 ? paddingX.value : 0}px`
  }

  return (
    <Button
      variant={variant.value as any}
      size={size.value as any}
      disabled={disabled.value as boolean}
      style={customStyles}
    >
      {text.value}
    </Button>
  )
}

function renderCard(config: ComponentConfig) {
  const {
    title,
    description,
    hasFooter,
    width,
    maxWidth,
    minHeight,
    padding,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    shadowSize,
  } = config.properties

  // Create shadow class based on selection
  const shadowClass = shadowSize.value !== "none" ? `shadow-${shadowSize.value}` : ""

  return (
    <Card
      className={shadowClass}
      style={{
        width: `${width.value}px`,
        maxWidth: maxWidth.value > 0 ? `${maxWidth.value}px` : undefined,
        minHeight: minHeight.value > 0 ? `${minHeight.value}px` : undefined,
        backgroundColor: backgroundColor.value as string,
        borderColor: borderColor.value as string,
        borderWidth: `${borderWidth.value}px`,
        borderRadius: `${borderRadius.value}px`,
      }}
    >
      <CardHeader>
        <CardTitle>{title.value}</CardTitle>
        <CardDescription>{description.value}</CardDescription>
      </CardHeader>
      <CardContent className={`p-${padding.value}`}>
        <p>Card content goes here</p>
      </CardContent>
      {hasFooter.value && (
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      )}
    </Card>
  )
}

function renderAlert(config: ComponentConfig) {
  const { variant, title, description, hasIcon } = config.properties

  return (
    <Alert variant={variant.value as any}>
      {hasIcon.value && <Info className="h-4 w-4" />}
      <AlertTitle>{title.value}</AlertTitle>
      <AlertDescription>{description.value}</AlertDescription>
    </Alert>
  )
}

function renderInput(config: ComponentConfig) {
  const { placeholder, disabled, hasLabel, label, type } = config.properties

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {hasLabel.value && <Label htmlFor="input">{label.value}</Label>}
      <Input
        type={type.value as string}
        id="input"
        placeholder={placeholder.value as string}
        disabled={disabled.value as boolean}
      />
    </div>
  )
}

function renderDropdown(config: ComponentConfig) {
  const { triggerText, items, hasIcons, align } = config.properties
  const menuItems = (items.value as string).split(",")

  const icons = [
    <Pencil key="edit" className="mr-2 h-4 w-4" />,
    <Eye key="view" className="mr-2 h-4 w-4" />,
    <Trash key="delete" className="mr-2 h-4 w-4" />,
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {triggerText.value} <MoreHorizontal className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align.value as any}>
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={item}>
            {hasIcons.value && icons[index % icons.length]}
            {item.trim()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function renderTabs(config: ComponentConfig) {
  const { defaultTab, tabItems, variant } = config.properties
  const tabs = (tabItems.value as string).split(",").map((tab) => tab.trim())

  return (
    <Tabs defaultValue={defaultTab.value as string}>
      <TabsList>
        {tabs.map((tab, index) => (
          <TabsTrigger key={tab} value={`tab${index + 1}`}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={tab} value={`tab${index + 1}`}>
          <div className="p-4 rounded-lg border">Content for {tab}</div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
