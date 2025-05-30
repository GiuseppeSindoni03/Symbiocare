import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { usePatients } from "../hooks/use-patients";
import { PatientItem } from "../types/patient.interface";
import { Group, Menu } from "@mantine/core";
import { Box } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function PatientsTable() {
  const { data, isLoading } = usePatients();
  const navigate = useNavigate();

  const columns: MRT_ColumnDef<PatientItem>[] = [
    {
      accessorKey: "user.cf",
      header: "Codice fiscale",
    },
    {
      accessorKey: "user.name",
      header: "Nome",
    },
    {
      accessorKey: "user.surname",
      header: "Cognome",
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "user.birthDate",
      header: "Data di nascita",
    },
  ];

  return (
    <Box w="100%" h="100%">
      <MantineReactTable
        enableColumnActions={false}
        enableColumnFilters={false}
        enableSorting={false}
        columns={columns}
        data={data ?? []}
        state={{ isLoading }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <Menu.Item
            key="view"
            onClick={() => {
              console.info(row.original.id);
              const id = row.original.id;
              console.log("Row.orginal: ", row.original);
              console.log("Id paziente tabella: ", id);
              navigate(`/patients/${id}`);
            }}
          >
            <Group>
              <IconUser size={16} />
              View Profile
            </Group>
          </Menu.Item>,
          // <Menu.Item
          //   key="remove"
          //   onClick={() => {
          //     console.info("Remove", row.original);
          //   }}
          // >
          //   <Group>
          //     <IconTrash size={16} />
          //     Remove
          //   </Group>
          // </Menu.Item>,
        ]}
      />
    </Box>
  );
}
