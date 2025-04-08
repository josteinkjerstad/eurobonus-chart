import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { ViatrumfTransaction } from "../../../models/viatrumf_transaction";

import styles from "./ViatrumfTransactionsTable.module.scss";

type TransactionsTableProps = {
  transactions: ViatrumfTransaction[];
};

export const ViatrumfTransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const columns: GridColDef[] = [
    {
      field: "purchase_date",
      headerName: "Date",
      flex: 0.6,
      sortable: true,
      valueGetter: value => new Date(value),
      type: "date",
      valueFormatter: (value: Date) =>
        value.toLocaleDateString("no-NB", {
          dateStyle: "short",
        }),
      filterable: true,
      headerClassName: styles.header,
    },
    { field: "store", headerName: "Vendor", flex: 1.5, sortable: true, filterable: true, headerClassName: styles.header },
    {
      field: "purchase_amount",
      type: "number",
      headerName: "Price",
      valueFormatter: (value: number) => `${value.toLocaleString("no-NO", { style: "currency", currency: "NOK" })}`,
      flex: 0.6,
      sortable: true,
      filterable: true,
      headerClassName: styles.header,
    },
    {
      field: "trumf_bonus",
      type: "number",
      headerName: "Trumf (kr)",
      valueFormatter: (value: number) => `${value.toLocaleString("no-NO", { style: "currency", currency: "NOK" })}`,
      flex: 0.6,
      sortable: true,
      filterable: true,
      headerClassName: styles.header,
    },
    {
      headerName: "Trumf (%)",
      field: "trumf_earning",
      type: "number",
      flex: 0.6,
      sortable: true,
      filterable: true,
      headerClassName: styles.header,
      valueGetter: (_value, row) => {
        return row.trumf_bonus && row.purchase_amount ? (row.trumf_bonus / row.purchase_amount) * 100 : 0;
      },
      valueFormatter: (value: number) => `${value.toFixed(2)}%`,
    },
    { field: "status", headerName: "Status", flex: 1, sortable: true, filterable: true, headerClassName: styles.header },
  ];

  return (
    <DataGrid
      rows={transactions}
      columns={columns}
      getRowId={row => row.id!}
      rowSelection={false}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
        sorting: {
          sortModel: [{ field: "purchase_date", sort: "desc" }],
        },
      }}
    />
  );
};
