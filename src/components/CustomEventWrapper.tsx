import { Popover, Button, Box } from "@mantine/core";
import React, { useCallback, ReactNode } from "react";
import { useDeleteAvailabilityMutation } from "../hooks/use-delete-availability.mutation";
import { CalendarEvent } from "../types/calendar-event";
import { useDisclosure } from "@mantine/hooks";
import { EventWrapperProps } from "react-big-calendar";

interface CustomEventWrapperProps extends EventWrapperProps<CalendarEvent> {
  children: ReactNode;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export const CustomEventWrapper: React.FC<CustomEventWrapperProps> = ({
  event,
  onEventClick,
  children,
}) => {
  const [opened, { close, open }] = useDisclosure();

  const deleteAvailability = useDeleteAvailabilityMutation(() => {});

  const handleClick = (e: React.MouseEvent) => {
    onEventClick(event, e);
    open();
  };

  const handleDeleteEvent = useCallback(() => {
    console.log("Elimina evento:", event);
    if (!event) return;
    deleteAvailability.mutate(event.id);
    close();
  }, [event]);

  return (
    <>
      <div
        //onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {children}
        <Popover
          opened={opened}
          onClose={() => close()}
          withArrow
          trapFocus={false}
          position="bottom"
          width="max-content"
        >
          <Popover.Target>
            <Box
              //onMouseEnter={open}
              onMouseEnter={open}
              onMouseLeave={close}
            >
              {children}
            </Box>
          </Popover.Target>
          <Popover.Dropdown>
            <Button
              color="red"
              onClick={handleDeleteEvent}
              // style={{ width: " 100vh", height: "100vh", zindex: "99" }}
            >
              Elimina
            </Button>
          </Popover.Dropdown>
        </Popover>
      </div>
    </>
  );
};
