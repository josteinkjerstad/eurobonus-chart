import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import styles from "./TransactionsTable.module.scss";
import type { Transaction } from "../../../models/transaction";
import type { Profile } from "../../../models/profile";
import { useState } from "react";

type TransactionsTableProps = {
  transactions: Transaction[];
  profiles: Profile[];
};

export const TransactionsTable = ({ transactions, profiles }: TransactionsTableProps) => {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  const columns: GridColDef[] = [
    ...(profiles.length > 1
      ? [
          {
            field: "profile_id",
            headerName: "Profile",
            flex: 0.5,
            sortable: true,
            filterable: true,
            headerClassName: styles.header,
            valueGetter: (value: string) => profiles.find(profile => profile.id === value)?.display_name!,
          },
        ]
      : []),
    {
      field: "date",
      type: "date",
      headerName: "Date",
      valueFormatter: (value: Date) =>
        value.toLocaleDateString("no-NB", {
          dateStyle: "short",
        }),
      valueGetter: value => new Date(value),
      flex: 0.4,
      sortable: true,
      filterable: true,
      headerClassName: styles.header,
    },
    { field: "activity", headerName: "Activity", flex: 2, sortable: true, filterable: true, headerClassName: styles.header },
    {
      field: "bonus_points",
      headerName: "Bonus Points",
      type: "number",
      flex: 0.6,
      sortable: true,
      filterable: true,
      headerClassName: styles.header,
    },
    {
      field: "level_points",
      headerName: "Level Points",
      type: "number",
      flex: 0.6,
      sortable: true,
      filterable: true,
      headerClassName: styles.header,
    },
  ];

  return (
    <DataGrid
      rows={transactions}
      columns={columns}
      sx={{
        ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
          "margin-top": "1em",
          "margin-bottom": "1em",
        },
      }}
      getRowId={row => row.id!}
      rowSelection={false}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[5, 10, 20, 50]}
      initialState={{
        sorting: {
          sortModel: [{ field: "date", sort: "desc" }],
        },
      }}
    />
  );
};
