import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { usePatients } from "../hooks/use-patients";
import { PatientItem } from "../types/patient.interface";
import {
  Table,
  Box,
  Loader,
  Menu,
  ActionIcon,
  Group,
  Tooltip,
} from "@mantine/core";
import { IconUser, IconDots } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function PatientsTable() {
  const { data, isLoading } = usePatients();
  const navigate = useNavigate();

  const columns: ColumnDef<PatientItem>[] = [
    {
      header: "Codice Fiscale",
      accessorKey: "user.cf",
    },
    {
      header: "Nome",
      accessorKey: "user.name",
    },
    {
      header: "Cognome",
      accessorKey: "user.surname",
    },
    {
      header: "Email",
      accessorKey: "user.email",
    },
    {
      header: "Data di nascita",
      accessorKey: "user.birthDate",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => navigate(`/patients/${row.original.id}`)}
              leftSection={<IconUser size={14} />}
            >
              Visualizza profilo
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box w="100%" h="100%">
      {isLoading ? (
        <Loader />
      ) : (
        <Table highlightOnHover withColumnBorders striped>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
}
