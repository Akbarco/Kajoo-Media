import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date?: Date | null
  setDate: (date: Date | null) => void
  placeholder?: string
  includeTime?: boolean
}

export function DatePicker({ date, setDate, placeholder = "Pilih tanggal", includeTime = true }: DatePickerProps) {
  const [time, setTime] = React.useState(date ? format(date, "HH:mm") : "00:00")

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(null)
      return
    }

    if (includeTime) {
      const [hours, minutes] = time.split(":").map(Number)
      selectedDate.setHours(hours)
      selectedDate.setMinutes(minutes)
    }
    
    setDate(selectedDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    if (date) {
      const newDate = new Date(date)
      const [hours, minutes] = newTime.split(":").map(Number)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setDate(newDate)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, includeTime ? "PPP HH:mm" : "PPP") : <span>{placeholder}</span>}
            {date && (
              <X 
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation()
                  setDate(null)
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0 shadow-2xl border-primary/10" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
          {includeTime && (
            <div className="border-t p-4 bg-muted/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Waktu</span>
                </div>
                <Input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="h-9 w-32 text-sm bg-background/50 border-primary/10 focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
