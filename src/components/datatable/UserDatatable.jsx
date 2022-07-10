import "./datatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import * as api from '../../api';
import * as access from '../../access'
import Button from '@mui/material/Button';
import { state_enum } from '../../config'
import ConfirmDialog from "../confirm/ConfirmDialog";
import { toast, ToastContainer } from 'react-toastify';
import { useStyles } from "../../utils"
const columns = [
  {
    field: "serial",
    headerName: "Sr. No.",
    width: 70
},
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 220 },
  {
    field: 'phone',
    headerName: 'Phone',
    type: 'number',
    width: 130,
  },
];

export default function UserDatatable() {
  const [data, setData] = useState();
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: '' });
  const classes = useStyles();
  const handleDelete = () => {
    let body = {
      state: state_enum.trashed
    }
    api.updateUser(confirmOpen.id, body)//fetch(`${url.base_url}/products`)
      // .then(results => results.json())
      .then(response => {
        
        if (response.status === 200) {
          let msg = "User is deleted."

          window.location.href = '/users?msg=' + msg;
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

  };

  useEffect(() => {
    api.fetchUsers()
      .then(response => {
        
        if (response.status === 200) {
          //append a serial number to the data
          let data = response.data.map((item, index) => {
            return {
              ...item,
              serial: index + 1
            }
          }
          )
          setData(data)
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
      })
    }, []);


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
            <Button
              disabled={access.user_edit ? false : true}
              onClick={() => {
                window.location.href = apiUrl
              }}
              variant="outlined" color="info" size="small">
              Edit
            </Button>

            <Button
              disabled={access.user_delete ? false : true}
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
  return (
    <div className="datatable">
       <ToastContainer icon={false} limit={1} autoClose={2000} />
      <ConfirmDialog
        title="Delete Post?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>
      {data && <DataGrid
      disableSelectionOnClick
      disableColumnSelector
        rows={data}
        className={classes.root}
        columns={columns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />}
    </div>
  );
}