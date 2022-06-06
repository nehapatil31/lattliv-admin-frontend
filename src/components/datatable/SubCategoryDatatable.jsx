import "./datatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import { url } from '../../config'
import * as api from '../../api';
import { Link } from "react-router-dom";
import * as access from '../../access'
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmDialog from "../confirm/ConfirmDialog";
import { state_enum } from '../../config'

export default function SubCategoryDatatable({subCategories, categories}) {
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: '' });
  const [multiActionVisibility, setMultiActionVisibility] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
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
        valueGetter: (params) =>params.row.createdBy?.name ? `${params.row.createdBy?.name}`:'-'
         
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
        let apiUrl = `/subcategories/${params.id}`
        return (
          <div className="cellAction">
            <Button
              disabled={access.subcategory_edit ? false : true}
              onClick={() => {
                window.location.href = apiUrl
              }}
              variant="outlined" color="info" size="small">
              Edit
            </Button>
            <Button
              disabled={access.subcategory_delete ? false : true}
              onClick={(e) => {
                e.preventDefault()
                setConfirmOpen({
                  state: true,
                  id: params.row.id
                })
              }}
              variant="outlined" color="error" size="small">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  const handleDelete = () => {
    let body = {
      state: state_enum.trashed
    }
    api.updatecategory(confirmOpen.id, body)//fetch(`${url.base_url}/products`)
      // .then(results => results.json())
      .then(response => {
        if (response.status === 200) {
          let msg = "SubCategory is deleted."

          window.location.href = '/categories?subcategory=true&&msg=' + msg;
        } else {
          toast.error("Some error occurred")
        }
      }).catch(error => {
        toast.error("Some error occurred")
      });
    // setData(data.filter((item) => item.id !== id));
  };

  if(!subCategories){
    return null
  }
  return (
    <div className="datatable">
      <ConfirmDialog
        title="Delete Post?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this sub category?
      </ConfirmDialog>
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