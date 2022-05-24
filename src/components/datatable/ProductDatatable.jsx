import "./datatable.scss";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import ConfirmDialog from "../confirm/ConfirmDialog";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradingIcon from '@mui/icons-material/Grading';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import {url, state_enum} from '../../config'
import * as api from '../../api';

const ProductDatatable = () => {
  const [data, setData] = useState();
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: '' });
  const [multiActionVisibility, setMultiActionVisibility] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
 
  const handleDelete = () => {
    console.log(confirmOpen.id)
    let body = {
      state: state_enum.trashed
    }
    fetch(`${url.base_url}/products/update/${confirmOpen.id}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(body)
    }).then((res)=>{
      if(res.status===200){
        let msg = "Product is deleted."
        
        window.location.href = '/products?msg='+ msg;
      }else {
        toast.error("Some error occurred")
      }
      
    })
    // setData(data.filter((item) => item.id !== id));
  };

  const updateState = (state)=>{
    let body = {
      ids: selectionModel,
      state: state,
      type: "product"
    }
    fetch(`${url.base_url}/states/update/bulk`, {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(body)
    }).then((res)=>{
      if(res.status===200){
        let msg = "Products are updated."
        
        window.location.href = '/products?msg='+ msg;
      }else {
        toast.error("Some error occurred")
      }
      
    })
  }
  useEffect(() => {
    api.fetchProducts()//fetch(`${url.base_url}/products`)
      // .then(results => results.json())
      .then(response => {
        setData(response.data);
      }).catch(error=>{
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
        let apiUrl = `/products/${params.id}`
        return (
          <div className="cellAction">
            <Link to={apiUrl} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div
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
            </div>
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
        Are you sure you want to delete this post?
      </ConfirmDialog>
      <ToastContainer icon={false} limit={1} autoClose={2000}/>
      <div >
        <Stack direction="row" spacing={2} style={{ display: multiActionVisibility ? 'block' : 'none' }}>
          <Button 
          onClick={()=>{
            updateState(state_enum.trashed)
           }}
          variant="outlined" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button 
          onClick={()=>{
            updateState(state_enum.review)
           }}
          variant="outlined" color="info" startIcon={<GradingIcon />}>
            Ready for review
          </Button>
          <Button
          onClick={()=>{
            updateState(state_enum.hidden)
           }}
           variant="outlined" color="warning" startIcon={<VisibilityOffIcon />}>
            Hide
          </Button>
          <Button 
          onClick={()=>{
            updateState(state_enum.published)
           }}
          variant="outlined" color="success" startIcon={<CheckIcon />}>
            Publish
          </Button>
        </Stack>
      </div>
      <br />
      {data && <DataGrid
        className="datagrid"
        disableSelectionOnClick
        disableColumnSelector
        rows={data}
        columns={userColumns.concat(actionColumn)}
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
};

export default ProductDatatable;
