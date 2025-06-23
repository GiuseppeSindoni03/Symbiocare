import {
  Calendar,
  dateFnsLocalizer,
  View,
  Views,
  EventWrapperProps,
} from "react-big-calendar";
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
import { useMemo, useCallback, useState, useEffect, Children } from "react";
import { useAddAVailabilityMutation } from "../hooks/use-add-availabilty.mutation";
import { CustomEventWrapper } from "../components/CustomEventWrapper";
import { CalendarEvent } from "../types/calendar-event";

const locales = {
  it: it,
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

  if (isLoading) return <Loader />;

  return (
    <div className={styles.calendarContainer}>
      <NavBar />
      <div style={{ height: "100vh" }}>
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
          components={{
            eventWrapper: ({ children, ...props }: any) => (
              <CustomEventWrapper {...props} onEventClick={handleSelectEvent}>
                {children}
              </CustomEventWrapper>
            ),
          }}
          titleAccessor="title"
        />
      </div>
    </div>
  );
}
