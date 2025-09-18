import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
  className?: string
}

// Option 1: Modify the default width in the component itself
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, mode, selected, onSelect, initialFocus, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(
      selected || new Date()
    )

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate()

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    const handleDateClick = (day: number) => {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      )
      onSelect?.(newDate)
    }

    const navigateMonth = (direction: "prev" | "next") => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev)
        if (direction === "prev") {
          newMonth.setMonth(prev.getMonth() - 1)
        } else {
          newMonth.setMonth(prev.getMonth() + 1)
        }
        return newMonth
      })
    }

    return (
      <div
        ref={ref}
        // Changed from "p-3 bg-white rounded-lg shadow-lg" to include width
        className={cn("p-4 bg-white rounded-lg shadow-lg w-80", className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-primary-50 rounded"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-base font-semibold">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-primary-50 rounded"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div key={day} className="text-sm font-medium text-center p-3 text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map(day => (
            <div key={`empty-${day}`} className="p-3" />
          ))}
          {days.map(day => {
            const isSelected = selected && 
              selected.getDate() === day &&
              selected.getMonth() === currentMonth.getMonth() &&
              selected.getFullYear() === currentMonth.getFullYear()
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "p-3 text-sm rounded hover:bg-primary-50 transition-colors min-h-[2.5rem] flex items-center justify-center",
                  isSelected && "bg-primary-600 text-white hover:bg-primary-700"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }