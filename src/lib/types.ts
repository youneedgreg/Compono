export type DeviceType = "mobile" | "tablet" | "desktop"

export type PropertyType = "string" | "number" | "boolean" | "select" | "color" | "range"

export interface SelectOption {
  label: string
  value: string
}

export interface PropertyConfig {
  type: PropertyType
  label: string
  value: string | number | boolean
  defaultValue?: string | number | boolean
  category?: string
  description?: string
  placeholder?: string
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
}

export interface ComponentConfig {
  id: string
  name: string
  description: string
  category: string
  properties: Record<string, PropertyConfig>
}

export interface ComponentData extends ComponentConfig {
  id: string
}
