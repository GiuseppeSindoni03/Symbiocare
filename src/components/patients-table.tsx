import { usePatients } from "../hooks/use-patients";
import { PatientItem } from "../types/patient.interface";
import { Box, Loader, Menu } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "@mantine/core/styles.css";

import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Table,
  useMantineReactTable,
} from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";

export default function PatientsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const search = searchParams.get("search") || "";

  const pagination = useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: limit,
    }),
    [page, limit]
  );

  const { data, isLoading } = usePatients(page, limit, search);
  const navigate = useNavigate();

  console.log("Pagination:", pagination, "Search:", search);
  console.log("Data length:", data?.data?.length, "Total:", data?.total);

  const columns = useMemo<MRT_ColumnDef<PatientItem>[]>(
    () => [
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
    ],
    []
  );

  console.log("Data:", data);

  const table = useMantineReactTable({
    data: data?.data ?? [],
    columns,
    enableTopToolbar: false,
    enablePagination: true,
    manualPagination: true,
    enableRowActions: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    positionPagination: "bottom",
    paginationDisplayMode: "pages",
    rowCount: Number(data?.total) ?? 0,
    mantinePaginationProps: {
      showRowsPerPage: false,
    },
    state: { pagination },
    onPaginationChange: (pageFn) => {
      const _pagination =
        typeof pageFn === "function" ? pageFn(pagination) : pageFn;

      const urlParams: Record<string, string> = {
        page: (_pagination.pageIndex + 1).toString(),
        limit: _pagination.pageSize.toString(),
      };

      if (search) {
        urlParams.search = search;
      }

      setSearchParams(urlParams);
    },
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item
          onClick={() => navigate(`/patients/${row.original.id}`)}
          leftSection={<IconUser size={24} />}
        >
          {" "}
          Visualizza il profilo
        </Menu.Item>
      </>
    ),
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <Box>
      <MantineReactTable table={table} />
      {/* <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        Debug: Total: {data?.total}, Current: {data?.data?.length}, Page:{" "}
        {pagination.pageIndex + 1}
      </div> */}
    </Box>
  );
}
