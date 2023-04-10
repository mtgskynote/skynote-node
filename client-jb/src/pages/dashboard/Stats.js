import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { Charts } from "../../components";

// import from data/dummy.js
import { customersColumns, customersRows } from "../../data/dummy";

const Stats = () => {
  return (
    <>
      <Paper style={{ height: "36rem", width: "100%", marginTop: "1rem" }}>
        <DataGrid
          rows={customersRows}
          columns={customersColumns}
          pageSize={9}
          checkboxSelection
          disableSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default Stats;
