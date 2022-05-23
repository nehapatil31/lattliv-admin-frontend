import "./datatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import { url } from '../../config'
import * as api from '../../api';
import { Link } from "react-router-dom";

const columns = [
  // { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'fullName',
      headerName: 'Created by',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.createdBy.name}`,
    },
];

export default function SubCategoryDatatable({subCategories}) {
  const [data, setData] = useState();

  
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 200,
      disableColumnFilter: true,
      renderCell: (params) => {
        let apiUrl = `/users/${params.id}`
        return (
          <div className="cellAction">
            <Link to={apiUrl} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            {/* <div
              className="deleteButton"
              // onClick={() => handleDelete(params.row.id)}
              onClick={(e) => {
                e.preventDefault()
                setConfirmOpen({
                  state: true,
                  id: params.row.id
                })
              }}
            >
              Delete
            </div> */}
          </div>
        );
      },
    },
  ];

  if(!subCategories){
    return null
  }
  return (
    <div className="datatable">
      {subCategories && <DataGrid
        rows={subCategories}
        className="datagrid"
        columns={columns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />}
    </div>
  );
}