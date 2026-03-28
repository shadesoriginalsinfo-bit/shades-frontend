import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center",
    "rounded-none border text-sm font-semibold tracking-[0.12em] uppercase whitespace-nowrap",
    "transition-all duration-300 outline-none select-none cursor-pointer",
    "focus-visible:ring-2 focus-visible:ring-[#C6A46C]/50 focus-visible:ring-offset-2",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[#C6A46C] text-white border-[#C6A46C]",
          "hover:bg-[#B8936A] hover:border-[#B8936A] hover:shadow-[0_4px_24px_rgba(198,164,108,0.35)]",
        ].join(" "),
        outline: [
          "bg-transparent text-[#C6A46C] border-[#C6A46C]",
          "hover:bg-[#C6A46C]/8 hover:shadow-[0_2px_12px_rgba(198,164,108,0.2)]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[#C6A46C] border-transparent",
          "hover:bg-[#C6A46C]/10",
        ].join(" "),
        secondary: [
          "bg-[#F8F4EE] text-[#9A7A50] border-[#E8DDD0]",
          "hover:bg-[#F0E8DC] hover:border-[#C6A46C]",
        ].join(" "),
        destructive: [
          "bg-red-50 text-red-600 border-red-200",
          "hover:bg-red-100 hover:border-red-400",
        ].join(" "),
        link: "text-[#C6A46C] underline-offset-4 hover:underline border-transparent bg-transparent",
      },
      size: {
        default: "h-10 gap-2 px-6",
        xs:     "h-6 gap-1 px-3 text-xs",
        sm:     "h-8 gap-1.5 px-4 text-xs",
        lg:     "h-12 gap-2 px-8 text-base tracking-[0.15em]",
        icon:   "size-10",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }