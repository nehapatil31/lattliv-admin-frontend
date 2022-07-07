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
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradingIcon from '@mui/icons-material/Grading';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';

export default function SubCategoryDatatable({subCategories, categories}) {
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: '' });
  const [multiActionVisibility, setMultiActionVisibility] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    {
      field: 'parent',
      headerName: 'Parent Category',
      width: 160,
      valueGetter: (params) =>{
        let parent = params.row.parent;
        let parentCategory = categories.find((item)=>item.id ===parent)
        return parentCategory?.name || "-";
      }
    },
      {
        field: 'fullName',
        headerName: 'Created by',
        sortable: false,
        width: 160,
        valueGetter: (params) =>params.row.createdBy?.name ? `${params.row.createdBy?.name}`:'-'
         
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
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
  const updateState = (state) => {
    let body = {
      ids: selectionModel,
      state: state,
      type: "category"
    }
    api.updateBulk(body)
      .then(response => {
        if (response.status === 200) {
          let msg = "Sub Categories are updated."

          window.location.href = '/categories?subcategory=true&&msg=' + msg;
        } else {
          toast.error("Some error occurred",{
            autoClose: 9000,
            pauseOnHover: true,
          })
        }
      }).catch(error => {
        toast.error("Some error occurred",{
          autoClose: 9000,
          pauseOnHover: true,
        })
      });
  }
  const handleDelete = () => {
    let body = {
      state: state_enum.trashed
    }
    api.updateCategory(confirmOpen.id, body)//fetch(`${url.base_url}/products`)
      // .then(results => results.json())
      .then(response => {
        if (response.status === 200) {
          let msg = "SubCategory is deleted."

          window.location.href = '/categories?subcategory=true&&msg=' + msg;
        } else {
          toast.error("Some error occurred",{
            autoClose: 9000,
            pauseOnHover: true,
          })
        }
      }).catch(error => {
        toast.error("Some error occurred",{
          autoClose: 9000,
          pauseOnHover: true,
        })
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
      <div >
        <ToastContainer icon={false} limit={1} autoClose={2000} />
        <Stack direction="row" spacing={2} style={{ display: multiActionVisibility ? 'block' : 'none' }}>
          <Button
            onClick={() => {
              updateState(state_enum.trashed)
            }}
            disabled={access.category_delete ? false : true}
            variant="outlined" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button
            disabled={access.category_edit ? false : true}
            onClick={() => {
              updateState(state_enum.review)
            }}
            variant="outlined" color="info" startIcon={<GradingIcon />}>
            Ready for review
          </Button>
          <Button
            disabled={access.category_hide ? false : true}
            onClick={() => {
              updateState(state_enum.hidden)
            }}
            variant="outlined" color="warning" startIcon={<VisibilityOffIcon />}>
            Hide
          </Button>
          <Button
            disabled={access.category_publish ? false : true}
            onClick={() => {
              updateState(state_enum.published)
            }}
            variant="outlined" color="success" startIcon={<CheckIcon />}>
            Publish
          </Button>
        </Stack>
      </div>
      <br/>
      {subCategories && <DataGrid
        rows={subCategories}
        className="datagrid"
        disableSelectionOnClick
        disableColumnSelector
        columns={columns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        onSelectionModelChange={(newSelectionModel, a) => {
          if (newSelectionModel.length) {
            setMultiActionVisibility(true)
          } else {
            setMultiActionVisibility(false)
          }
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
      />}
    </div>
  );
}