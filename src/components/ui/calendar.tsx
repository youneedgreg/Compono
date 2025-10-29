"use client"

import * as React from "react"
import moment from "moment"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: "single" | "range" | "multiple";
  initialFocus?: boolean;
}

function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
  initialFocus,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(moment().startOf('month'));

  const daysInMonth = Array.from({ length: currentMonth.daysInMonth() }, (_, i) =>
    currentMonth.clone().date(i + 1)
  );

  const firstDayOfMonth = currentMonth.day(); // 0 for Sunday, 1 for Monday, etc.
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  const handleDayClick = (day: moment.Moment) => {
    if (onSelect) {
      onSelect(day.toDate());
    }
  };

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex justify-between items-center mb-4">
        <button
          className={cn(buttonVariants({ variant: "outline" }), "size-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-sm font-medium">
          {currentMonth.format("MMMM YYYY")}
        </div>
        <button
          className={cn(buttonVariants({ variant: "outline" }), "size-7 bg-transparent p-0 opacity-50 hover:opacity-100")}
          onClick={handleNextMonth}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mt-2">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="size-8"></div>
        ))}
        {daysInMonth.map((day) => (
          <button
            key={day.toISOString()}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "size-8 p-0 font-normal",
              selected && moment(selected).isSame(day, 'day') && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
            )}
            onClick={() => handleDayClick(day)}
          >
            {day.date()}
          </button>
        ))}
      </div>
    </div>
  )
}

export { Calendar }