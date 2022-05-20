import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import {url} from '../../config'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 130 },
  {
    field: 'phone',
    headerName: 'Phone',
    type: 'number',
    width: 130,
  },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
];

export default function UserDatatable() {
    const [data, setData] = useState();

    useEffect(() => {
        fetch(`${url.base_url}/users`)
          .then(results => results.json())
          .then(data => {
            setData(data);
            console.log(data)
          });
      }, []);

    return (
      <div style={{ height: 400, width: '100%' }}>
        {data && <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />}
      </div>
    );
  }