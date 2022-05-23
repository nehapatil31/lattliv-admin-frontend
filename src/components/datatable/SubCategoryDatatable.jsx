import "./datatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import { url } from '../../config'
import * as api from '../../api';
import { Link } from "react-router-dom";



export default function SubCategoryDatatable({subCategories, categories}) {

  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
      {
        field: 'parent',
        headerName: 'Parent Category',
        width: 160,
        valueGetter: (params) =>{
          let parent = params.row.parent;
          let parentCategory = categories.find((item)=>item.id==parent)
          return parentCategory.name
        }
      },
      {
        field: 'fullName',
        headerName: 'Created by',
        // description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
          `${params.row.createdBy.name}`,
      },
      {
        field: "status",
        headerName: "Status",
        width: 160,
        renderCell: (params) => {
          return (
            <div className={`cellWithStatus ${params.row.state.name}`}>
              {params.row.state.name}
            </div>
          );
        },
      }
  ];
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