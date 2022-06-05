import "./datatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import { url } from '../../config'
import * as api from '../../api';
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";


export default function CategoryDatatable({categories}) {
  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
      {
        field: 'fullName',
        headerName: 'Created by',
        // description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>params.row.createdBy?.name ? `${params.row.createdBy?.name}`:'-'
      },
      {
        field: 'children',
        headerName: 'Sub Category',
        width: 230,
        renderCell: (params) =>{
          if(!params.row.children.length) return (<div>No sub categories</div>)
          let children = ''
          for(let item of params.row.children){
            children += item.name
            children += ' | '
          }
          return (
            <Tooltip
              title={
                <ul className="subcategory-list">
                  {params.row.children.map(function (object) {
                    return <li>{object.name}</li>;
                  })}
                </ul>
              }
            >
              <div>{children}</div>
            </Tooltip>
          )
        }
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
      },
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

  if(!categories){
    return null
  }

  return (
    <div className="datatable">
      {categories && <DataGrid
        rows={categories}
        className="datagrid"
        columns={columns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />}
    </div>
  );
}