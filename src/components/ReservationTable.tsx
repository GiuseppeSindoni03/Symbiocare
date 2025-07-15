import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useReservations,
  useReservationsTable,
} from "../hooks/use-reservations";
import { ReservationItem } from "../types/reservation-item";
import {
  ActionIcon,
  Box,
  Loader,
  Text,
  Group,
  Modal,
  TextInput,
  Button,
  Textarea,
} from "@mantine/core";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { format } from "date-fns";
import { CirclePlus, Space } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useAddMedicalExamination } from "../hooks/use-add-medical-examination.mutation";
import { MedicalExaminationDTO } from "../types/medical-examination.dto";
import { toast } from "react-toastify";

type ReservationsTableProps = {
  patient: string;
  search: string;
  page: number;
  limit: number;
  onPaginationChange: (params: { page: number; limit: number }) => void;
};

export default function ReservationsTable({
  patient,
  search,
  page,
  limit,
  onPaginationChange,
}: ReservationsTableProps) {
  const navigate = useNavigate();

  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const [opened, handler] = useDisclosure(false);

  const mutation = useAddMedicalExamination();

  const { data, isLoading } = useReservationsTable(
    patient,
    page,
    limit,
    search
  );

  const form = useForm({
    initialValues: {
      note: "",
      motivation: "",
    },
  });

  const pagination = useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: limit,
    }),
    [page, limit, search]
  );

  const handleModalClose = useCallback(() => {
    handler.close();
    form.reset();
  }, [handler, form]);

  const handlePaginationChange = useCallback(
    (pageFn: any) => {
      const _pagination =
        typeof pageFn === "function" ? pageFn(pagination) : pageFn;

      onPaginationChange({
        page: _pagination.pageIndex + 1,
        limit: _pagination.pageSize,
      });
    },
    [pagination, onPaginationChange]
  );

  const columns = useMemo<MRT_ColumnDef<ReservationItem>[]>(
    () => [
      {
        header: "Giorno",
        accessorFn: (row) => row.startTime,
        id: "day",
        Cell: ({ cell }) => (
          <Text>{format(new Date(cell.getValue<string>()), "dd/MM/yyyy")}</Text>
        ),
      },

      {
        header: "Inizio",
        accessorKey: "startTime",
        Cell: ({ cell }) => (
          <Text>{format(new Date(cell.getValue<string>()), "HH:mm")}</Text>
        ),
      },
      {
        header: "Fine ",
        accessorKey: "endTime",
        Cell: ({ cell }) => (
          <Text>{format(new Date(cell.getValue<string>()), "HH:mm")}</Text>
        ),
      },

      {
        header: "Tipo di visita",
        accessorKey: "visitType",
        Cell: ({ cell }) => {
          const visitType = cell.getValue<string>();
          return (
            <Text>
              {visitType === "FIRST_VISIT" ? "Prima visita" : "Controllo"}
            </Text>
          );
        },
      },
    ],
    []
  );

  console.log("Data reservations: ", data);

  const table = useMantineReactTable({
    data: data?.reservations ?? [],

    columns,
    enableRowActions: true,
    enableTopToolbar: false,
    enablePagination: true,
    manualPagination: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    positionPagination: "bottom",
    paginationDisplayMode: "pages",
    rowCount: data?.total ?? 0,

    mantinePaginationProps: {
      showRowsPerPage: false,
    },

    state: { pagination },
    onPaginationChange: handlePaginationChange,
    renderRowActions: ({ row }) => (
      <Box
        // style={(theme) => ({
        //   padding: "8px",
        //   cursor: "pointer",
        //   transition: "all 0.2s ease",
        //   "&:hover": {
        //     transform: "translateY(-1px)",
        //     opacity: 0.85,
        //   },
        // })}
        onClick={() => {
          setSelectedReservationId(row.original.id);
          handler.open();
        }}
      >
        <ActionIcon
          variant="subtle"
          color="var(--accent-primary)"
          radius="xl"
          size="lg"
        >
          <CirclePlus size={22} />
        </ActionIcon>
      </Box>
    ),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!selectedReservationId) {
        toast.error("Nessuna prenotazione selezionata");
        return;
      }

      mutation.mutate(
        {
          medicalExamination: form.values,
          reservationId: selectedReservationId,
        },
        {
          onSuccess: () => {
            toast.success("Visita medica inserita con successo");
            handler.close();
            form.reset();
          },
          onError: (error) => {
            toast.error("Errore nell'aggiunta della visita: " + String(error));
          },
        }
      );
    },
    [form, handler, mutation, selectedReservationId]
  );

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
        <Loader size="sm" />
      </div>
    );

  if (!data || data.reservations.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Group>
          <Text size="lg" fw={500}>
            Nessuna prenotazione registrata nel sistema
          </Text>
          <Loader size="sm" />
        </Group>
      </div>
    );
  }

  return (
    <Box>
      <MantineReactTable table={table} />
      <Modal
        opened={opened}
        onClose={handler.close}
        title={null} // titolo custom dentro il body
        size="auto"
        radius="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <div style={{ textAlign: "center", padding: "1.5rem" }}>
          <h2
            style={{
              marginBottom: "0.5rem",
              fontSize: "1.5rem",
              color: "var(--text-primary)",
            }}
          >
            Aggiungi visita medica
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Inserisci il report della visita medica
          </p>

          <div>
            <form onSubmit={handleSubmit}>
              <TextInput
                size="lg"
                {...form.getInputProps("motivation")}
                placeholder="Inserisci la motivazione della visita"
                w={"400px"}
                style={{ marginBottom: "1rem" }}
                required
              />
              <Textarea
                size="lg"
                {...form.getInputProps("note")}
                placeholder="Inserisci le note della visita"
                w={"400px"}
                style={{ marginBottom: "1rem" }}
                required
              />
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  loading={mutation.isPending}
                  className="button"
                  // disabled={}
                >
                  Aggiungi
                </Button>
                {/* <Space w={"xl"} /> */}
                <Button
                  className="button"
                  onClick={handleModalClose}
                  disabled={mutation.isPending}
                >
                  Annulla
                </Button>
              </div>
            </form>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button onClick={handler.close} className="button">
              Chiudi
            </button>
          </div>
        </div>
      </Modal>
    </Box>
  );
}
