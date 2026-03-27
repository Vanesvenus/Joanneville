import { useState } from "react";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, Rows3, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CalendarGrid from "@/components/CalendarGrid";
import WeekView from "@/components/WeekView";
import DayView from "@/components/DayView";
import AppointmentSidebar from "@/components/AppointmentSidebar";
import { sampleAppointments, appointmentTypeLabels, AppointmentType } from "@/lib/appointments";

type ViewMode = "month" | "week" | "day";

const legendItems: { type: AppointmentType; label: string }[] = [
  { type: "cut", label: appointmentTypeLabels.cut },
  { type: "maintenance", label: appointmentTypeLabels.maintenance },
  { type: "color", label: appointmentTypeLabels.color },
  { type: "lightening", label: appointmentTypeLabels.lightening },
];

const legendDotStyles: Record<string, string> = {
  cut: "bg-cal-cut",
  maintenance: "bg-cal-maintenance",
  color: "bg-cal-color",
  lightening: "bg-cal-lightening",
};

export default function Index() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const goBack = () => {
    if (viewMode === "month") setCurrentMonth(m => subMonths(m, 1));
    else if (viewMode === "week") setCurrentMonth(m => subWeeks(m, 1));
    else setSelectedDate(d => subDays(d, 1));
  };

  const goForward = () => {
    if (viewMode === "month") setCurrentMonth(m => addMonths(m, 1));
    else if (viewMode === "week") setCurrentMonth(m => addWeeks(m, 1));
    else setSelectedDate(d => addDays(d, 1));
  };

  const goToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const headerLabel =
    viewMode === "month"
      ? format(currentMonth, "MMMM yyyy")
      : viewMode === "week"
        ? `Week of ${format(currentMonth, "MMM d, yyyy")}`
        : format(selectedDate, "EEEE, MMM d, yyyy");

  // In day view, hide the sidebar since DayView already shows detail
  const showSidebar = viewMode !== "day";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Appointments</h1>
              <p className="text-sm text-muted-foreground">Manage your schedule</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden mr-2">
              {([
                { mode: "month" as const, icon: LayoutGrid, label: "Month" },
                { mode: "week" as const, icon: Rows3, label: "Week" },
                { mode: "day" as const, icon: CalendarDays, label: "Day" },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                    viewMode === mode
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={goToday} className="text-xs font-mono">
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[180px] text-center font-mono">
                {headerLabel}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goForward}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {legendItems.map(item => (
            <div key={item.type} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${legendDotStyles[item.type]}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {viewMode === "month" ? (
              <CalendarGrid
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                appointments={sampleAppointments}
              />
            ) : viewMode === "week" ? (
              <WeekView
                currentDate={currentMonth}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                appointments={sampleAppointments}
              />
            ) : (
              <DayView
                selectedDate={selectedDate}
                appointments={sampleAppointments}
              />
            )}
          </motion.div>

          {showSidebar && (
            <AppointmentSidebar
              selectedDate={selectedDate}
              appointments={sampleAppointments}
            />
          )}
        </div>
      </div>
    </div>
  );
}
