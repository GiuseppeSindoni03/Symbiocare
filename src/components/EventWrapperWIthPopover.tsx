import React from "react";
import { EventWrapperProps } from "react-big-calendar";
import { Button, Divider, Popover, Text, Title, Tooltip } from "@mantine/core";
import {
  Calendar1Icon,
  ClipboardPlus,
  Info,
  Mars,
  Venus,
  NonBinary,
  UserIcon,
} from "lucide-react";

import { ReservationCalendarEvent } from "../types/reservation-calendar-events";
import styles from "../styles/calendar.module.css";
import { useNavigate } from "react-router-dom";
import { usePatchReservationMutation } from "../hooks/use-patch-reservation.mutation";

interface Props extends EventWrapperProps<ReservationCalendarEvent> {
  selectedEvent: ReservationCalendarEvent | undefined;
  setSelectedEvent: (event: ReservationCalendarEvent | undefined) => void;
  children?: React.ReactNode;
}

export const EventWrapperWithPopover: React.FC<Props> = ({
  event,
  children,
  selectedEvent,
  setSelectedEvent,
}) => {
  const mutation = usePatchReservationMutation();
  const isOpen = selectedEvent === event;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedEvent(isOpen ? undefined : event);
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
      onClose={() => setSelectedEvent(undefined)}
      withArrow
      trapFocus={false}
      position="bottom"
      withinPortal={true}
      offset={5}
      width={300}
    >
      <Popover.Target>{cloned}</Popover.Target>
      <Popover.Dropdown onClick={handlePopoverClick}>
        <div>
          <div className={styles.headerPopover}>
            <Title order={4} className={styles.title}>
              Info prenotazione
            </Title>
          </div>

          <div className={styles.infoPopover}>
            <Text>
              <Text fw={900}>
                Tipo di visita <ClipboardPlus size={15} />
              </Text>
              {selectedEvent?.visitType === "CONTROL"
                ? "Controllo"
                : "Prima visita"}
            </Text>
            <Text>
              <Text fw={900}>
                Data creazione <Calendar1Icon size={15} />
              </Text>
              {selectedEvent?.createdAt
                ? new Date(selectedEvent.createdAt).toLocaleDateString(
                    "it-IT",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "—"}
            </Text>
            <Text fw={900}>
              Stato <Calendar1Icon size={15} />
            </Text>
            {selectedEvent?.status} {selectedEvent?.id}
            <Divider my={"sm"} />
            <div className={styles.infoPatient}>
              <div className={styles.headerPopover}>
                <Title order={5}>
                  Paziente <UserIcon size={15} />
                </Title>
                <Tooltip label="Vedi dettagli paziente">
                  <Button
                    onClick={() =>
                      navigate(`/patients/${selectedEvent?.patient.id}`)
                    }
                    variant="subtle"
                    size="xs"
                  >
                    <Info size={14} />
                  </Button>
                </Tooltip>
              </div>
              {selectedEvent?.patient.name} {selectedEvent?.patient.surname}{" "}
              {selectedEvent?.patient.gender === "Uomo" && <Mars size={14} />}
              {selectedEvent?.patient.gender === "Donna" && <Venus size={14} />}
              {selectedEvent?.patient.gender !== "Uomo" &&
                selectedEvent?.patient.gender !== "Donna" && (
                  <NonBinary size={14} />
                )}
              <Text>{selectedEvent?.patient.cf}</Text>
              {selectedEvent?.status === "PENDING" && (
                <>
                  <Divider my={"sm"} />
                  <div className={styles.choose}>
                    <Button
                      className={styles.confirm}
                      onClick={() =>
                        mutation.mutate({
                          reservationId: selectedEvent.id,
                          status: "confirm",
                        })
                      }
                    >
                      Conferma
                    </Button>
                    <Button
                      className={styles.decline}
                      onClick={() =>
                        mutation.mutate({
                          reservationId: selectedEvent.id,
                          status: "decline",
                        })
                      }
                    >
                      Rifiuta
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
