import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { it } from "date-fns/locale";
import { NavBar } from "../components/navbar";
import { useAvailability } from "../hooks/use-availability";
import { Loader } from "@mantine/core";
import styles from "../styles/calendar.module.css";
import { useMemo, useCallback, useState } from "react";
import { useAddAVailabilityMutation } from "../hooks/use-add-availabilty.mutation";
import { CustomEventWrapper } from "../components/CustomEventWrapper";
import { CalendarEvent } from "../types/calendar-event";

const locales = {
  it: it,
};
const formats = {
  timeGutterFormat: "HH:mm",

  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: it })} – ${format(end, "HH:mm", {
      locale: it,
    })}`,
  selectRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: it })} – ${format(end, "HH:mm", {
      locale: it,
    })}`,

  dayFormat: (date: Date) => format(date, "d", { locale: it }),
  weekdayFormat: (date: Date) => format(date, "EEEEEE", { locale: it }),
  dayHeaderFormat: (date: Date) => format(date, "EEEE d MMMM", { locale: it }),
  agendaDateFormat: (date: Date) => format(date, "EEEE d MMMM", { locale: it }),
  agendaTimeFormat: "HH:mm",
  agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: it })} – ${format(end, "HH:mm", {
      locale: it,
    })}`,

  monthHeaderFormat: (date: Date) => format(date, "MMMM yyyy", { locale: it }),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "d MMM", { locale: it })} – ${format(end, "d MMM yyyy", {
      locale: it,
    })}`,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const { data: availabilityData, isLoading } = useAvailability();
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const mutation = useAddAVailabilityMutation(() => {});

  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();

  const events: CalendarEvent[] = useMemo(() => {
    const fetched: CalendarEvent[] =
      availabilityData?.flatMap((group) =>
        group.slots.map((slot) => ({
          id: slot.id,
          title: slot.title,
          start: new Date(slot.startTime),
          end: new Date(slot.endTime),
        }))
      ) ?? [];

    return fetched;
  }, [availabilityData]);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const title = window.prompt("Nuova disponibilità");

      if (title)
        mutation.mutate({
          title: title,
          start: start.toISOString(),
          end: end.toISOString(),
        });
    },
    []
  );

  // useEffect(() => {
  //   console.log("SelectedEvent: ", selectedEvent);
  //   console.log("Result: ", !!selectedEvent);
  // }, [selectedEvent]);

  const handleSelectEvent = useCallback((event?: CalendarEvent) => {
    console.log("Event: ", event);
    setSelectedEvent(event);
  }, []);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // occupa tutto lo schermo
          width: "100vw", // opzionale ma consigliato
        }}
      >
        <Loader size="xl" />
      </div>
    );

  return (
    <div className={styles.container}>
      <Calendar
        selectable
        onSelectSlot={handleSelectSlot}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        onSelectEvent={handleSelectEvent}
        formats={formats}
        components={{
          eventWrapper: ({ children, ...props }: any) => (
            <CustomEventWrapper {...props} onEventClick={handleSelectEvent}>
              {children}
            </CustomEventWrapper>
          ),
        }}
        titleAccessor="title"
        culture="it"
      />
    </div>
  );
}
