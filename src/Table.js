import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";

const initialSort = [
    {
      field: "engine_name",
      dir: "asc",
    },
  ];
const Table = ({result}) => {
    const [sort, setSort] = React.useState(initialSort);
    return (
        <div style = {{width:"80%", margin:"auto"}}>
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
          <GridColumn sortable = {true} field="engine_name" title="Engine Name" />
          <GridColumn sortable = {true} field="result" title="Result"/>
          <GridColumn sortable = {true} field="category" title="Category" />
        </Grid>
        </div>
      );
};
export default Table;