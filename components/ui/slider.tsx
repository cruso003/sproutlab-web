"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  max: number
  step: number
  onValueChange: (value: number[]) => void
  className?: string
  "aria-label"?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, max, step, onValueChange, className, "aria-label": ariaLabel = "Slider", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange([newValue])
    }

    return (
      <input
        ref={ref}
        type="range"
        min="0"
        max={max}
        step={step}
        value={value[0] || 0}
        onChange={handleChange}
        aria-label={ariaLabel}
        className={cn(
          "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white",
          "[&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500",
          "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white",
          "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md",
          className
        )}
        {...props}
      />
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
