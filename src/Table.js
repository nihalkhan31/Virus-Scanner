import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { GridPDFExport } from "@progress/kendo-react-pdf";
const initialSort = [
    {
      field: "engine_name",
      dir: "asc",
    },
  ];
const Table = ({result}) => {
    const [sort, setSort] = React.useState(initialSort);
    let gridPDFExport;
  const exportPDF = () => {
    if (gridPDFExport) {
      gridPDFExport.save(result);
    }
  };
    const grid = (
        <Grid
          style={{
            height: "400px",
          }}
          data={orderBy(result, sort)}
        sortable={true}
        sort={sort}
        onSortChange={(e) => {
        setSort(e.sort);
        }}
        >
        <GridToolbar>
        <button
          title="Export PDF"
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
          style={{width:"5rem"}}
          onClick={exportPDF}
        >
          Export PDF
        </button>
      </GridToolbar>
          <GridColumn sortable = {true} field="engine_name" title="Engine Name" />
          <GridColumn sortable = {true} field="result" title="Result"/>
          <GridColumn sortable = {true} field="category" title="Category" />
        </Grid>
    );
        return (
          <div>
            {grid}
            <GridPDFExport
              ref={(pdfExport) => (gridPDFExport = pdfExport)}
              paperSize="A4"
              scale={0.8}
            >
              {grid}
            </GridPDFExport>
          </div>
        );
};
export default Table;