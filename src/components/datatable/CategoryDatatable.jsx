import * as access from '../../access'
import "./datatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import * as api from '../../api';
import Tooltip from "@mui/material/Tooltip";
import Button from '@mui/material/Button';
import ConfirmDialog from "../confirm/ConfirmDialog";
import { state_enum } from '../../config'
import { toast, ToastContainer } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradingIcon from '@mui/icons-material/Grading';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';

export default function CategoryDatatable({ categories }) {
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: '' });
  const [multiActionVisibility, setMultiActionVisibility] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const handleDelete = () => {
    console.log(confirmOpen.id)
    let body = {
      state: state_enum.trashed
    }
    api.updatecategory(confirmOpen.id, body)//fetch(`${url.base_url}/products`)
      // .then(results => results.json())
      .then(response => {
        if (response.status === 200) {
          let msg = "Category is deleted."

          window.location.href = '/categories?msg=' + msg;
        } else {
          toast.error("Some error occurred")
        }
      }).catch(error => {
        toast.error("Some error occurred")
      });
    // setData(data.filter((item) => item.id !== id));
  };
  const updateState = (state) => {
    let body = {
      ids: selectionModel,
      state: state,
      type: "category"
    }
    api.updateBulk(body)//fetch(`${url.base_url}/products`)
      // .then(results => results.json())
      .then(response => {
        if (response.status === 200) {
          let msg = "Categories are updated."

          window.location.href = '/categories?msg=' + msg;
        } else {
          toast.error("Some error occurred")
        }
      }).catch(error => {
        toast.error("Some error occurred")
      });
  }
  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'fullName',
      headerName: 'Created by',
      // description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) => params.row.createdBy?.name ? `${params.row.createdBy?.name}` : '-'
    },
    {
      field: 'children',
      headerName: 'Sub Category',
      width: 230,
      renderCell: (params) => {
        if (!params.row.children.length) return (<div>No sub categories</div>)
        let children = ''
        for (let item of params.row.children) {
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
        let apiUrl = `/categories/${params.id}`
        return (
          <div className="cellAction">
            <Button
              disabled={access.category_edit ? false : true}
              onClick={() => {
                window.location.href = apiUrl
              }}
              variant="outlined" color="info" size="small">
              Edit
            </Button>
            <Button
              disabled={access.category_delete ? false : true}
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

  if (!categories) {
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
        Are you sure you want to delete this post?
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
      {categories && <DataGrid
        rows={categories}
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