import type { Metadata } from "next"
import ComponentCustomizer from "@/components/component-customizer"

export const metadata: Metadata = {
  title: "Compono - UI Component Customizer",
  description: "Customize and generate code for shadcn/ui components",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <ComponentCustomizer />
    </div>
  )
}
