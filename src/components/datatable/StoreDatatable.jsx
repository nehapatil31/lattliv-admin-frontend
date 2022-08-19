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
    width: 70,
  },
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'place', headerName: 'Location', width: 130 },
  { field: 'address', headerName: 'Address', width: 130 },
  { field: 'email', headerName: 'Email', width: 170 },
  { field: 'manager', headerName: 'Manager', width: 130 },
  { field: 'map', headerName: 'Map link', width: 110 },
  { field: 'timings', headerName: 'Timings', width: 110 }
];
const StoreDatatable = () => {
  const [data, setData] = useState();
  const classes = useStyles();
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: '' });

  const handleDelete = () => {
    let body = {
      id: confirmOpen.id
    }
    api.deleteStore(body)
      .then(response => {
        if (response.status === 200) {
          let msg = "Store is deleted."

          window.location.href = '/stores?msg=' + msg;
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
    api.fetchStores()
      .then(response => {
        let data = response.data;
        let serial = 1;
        data.forEach((element) => {
          element.serial = serial;
          serial++;
        });
        setData(data);
        console.log(data)
      }).catch(error => {
        console.log(error)
      });
  }, []);


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 200,
      disableColumnFilter: true,
      renderCell: (params) => {
        let apiUrl = `/stores/${params.id}`
        return (
          <div className="cellAction">
            <Button
              disabled={access.store_edit ? false : true}
              onClick={() => {
                window.location.href = apiUrl
              }}
              variant="outlined" color="info" size="small">
              Edit
            </Button>

            <Button
              disabled={access.store_delete ? false : true}
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
      <ConfirmDialog
        title="Delete Post?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this Store?
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
};

export default StoreDatatable;
