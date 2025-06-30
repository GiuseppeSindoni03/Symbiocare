import { Calendar, View, Views, EventWrapperProps } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { getRangeFromDateAndView, formats, localizer } from "../utils/calendar";
import { useAvailability } from "../hooks/use-availability";
import { Button, Loader, Popover } from "@mantine/core";
import styles from "../styles/calendar.module.css";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useAddAVailabilityMutation } from "../hooks/use-add-availabilty.mutation";
import { CalendarEvent } from "../types/calendar-event";
import { useDeleteAvailabilityMutation } from "../hooks/use-delete-availability.mutation";
import React from "react";
import { Range } from "../hooks/use-reservations";
import { useSearchParams } from "react-router-dom";
import { CustomToolbar } from "../components/CustomToolBar";
import { useQueryClient } from "@tanstack/react-query";

interface EventWrapperWithChildrenProps
  extends EventWrapperProps<CalendarEvent> {
  children?: React.ReactNode;
}

export default function CalendarAvailability() {
  const initialRange: Range = getRangeFromDateAndView(new Date(), Views.WEEK);

  const [range, setRange] = useState<Range>(initialRange);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { data: availabilityData, isLoading } = useAvailability(range);
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const mutation = useAddAVailabilityMutation(range);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAvailability = useDeleteAvailabilityMutation();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (range) {
      params.set("start", range.start.toISOString());
      params.set("end", range.end.toISOString());
    }
    setSearchParams(params);
  }, [range]);

  useEffect(() => {
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    if (startParam && endParam) {
      const start = new Date(startParam);
      const end = new Date(endParam);
      setRange({ start, end });
    } else {
      const now = new Date();
      const fallbackRange = getRangeFromDateAndView(now, currentView);
      setRange(fallbackRange);
      setSearchParams({
        start: fallbackRange.start.toISOString(),
        end: fallbackRange.end.toISOString(),
      });
    }
  }, []);

  const handleDeleteEvent = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (!selectedEventId) return;

      setIsDeleting(true);
      deleteAvailability.mutate(selectedEventId, {
        onSuccess: () => {
          setSelectedEventId(null);
          setIsDeleting(false);
        },
        onError: () => {
          setIsDeleting(false);
        },
      });
    },
    [selectedEventId, deleteAvailability]
  );

  const events: CalendarEvent[] = useMemo(() => {
    return (
      availabilityData?.flatMap((group) =>
        group.slots.map((slot) => ({
          id: slot.id,
          title: slot.title,
          start: new Date(slot.startTime),
          end: new Date(slot.endTime),
        }))
      ) ?? []
    );
  }, [availabilityData]);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (isDeleting) return;

      const title = window.prompt("Nuova disponibilità");
      if (title)
        mutation.mutate({
          title,
          start: start.toISOString(),
          end: end.toISOString(),
        });
    },
    [mutation, isDeleting]
  );

  const handleNavigate = useCallback(
    (date: Date) => {
      setCurrentDate(date);
      const newRange = getRangeFromDateAndView(date, currentView);
      setRange(newRange);

      setSearchParams({
        start: newRange.start.toISOString(),
        end: newRange.end.toISOString(),
      });
    },
    [currentView, setSearchParams]
  );

  const EventWrapperWithPopover: React.FC<EventWrapperWithChildrenProps> = ({
    event,
    children,
  }) => {
    const isOpen = selectedEventId === event.id;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedEventId(isOpen ? null : event.id);
    };

    const handlePopoverClick = (e: React.MouseEvent) => {
      // Impedisci che i click all'interno del popover si propaghino al calendario
      e.stopPropagation();
      e.preventDefault();
    };

    if (!React.isValidElement(children)) return <>{children}</>;

    const cloned = React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      style: {
        ...(children as React.ReactElement<any>).props.style,
        cursor: "pointer",
        position: "relative",
      },
    });

    return (
      <Popover
        opened={isOpen}
        onClose={() => setSelectedEventId(null)}
        withArrow
        trapFocus={false}
        position="bottom-start"
        withinPortal={true}
        offset={5}
      >
        <Popover.Target>{cloned}</Popover.Target>
        <Popover.Dropdown onClick={handlePopoverClick}>
          <Button color="red" onClick={handleDeleteEvent}>
            Elimina
          </Button>
        </Popover.Dropdown>
      </Popover>
    );
  };

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // occupa tutto lo schermo
        }}
      >
        <Loader size="xl" />
      </div>
    );

  return (
    <div className={styles.container}>
      <Calendar
        // style={{ height: "100vh" }}
        date={currentDate}
        selectable={currentView != Views.MONTH ? true : false}
        onSelectSlot={handleSelectSlot}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        onNavigate={handleNavigate}
        formats={formats}
        titleAccessor="title"
        culture="it"
        components={{
          eventWrapper: EventWrapperWithPopover,
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              views={[Views.DAY, Views.WEEK, Views.MONTH]}
              invalidate={() => {
                if (!range) return;
                queryClient.invalidateQueries({
                  queryKey: ["availabilities", range],
                });
              }}
              toggleFilter={undefined}
            />
          ),
        }}
      />
    </div>
  );
}
