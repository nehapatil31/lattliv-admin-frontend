import "./datatable.scss";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import * as access from '../../access'
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { deleteItem, restoreItem } from "../../api";
import * as api from '../../api';

import { state_enum } from '../../config'
import DeleteIcon from '@mui/icons-material/Delete';

import Stack from '@mui/material/Stack';
import { useStyles } from "../../utils"
const TrashDatatable = ({ data, type }) => {
    const [multiActionVisibility, setMultiActionVisibility] = useState(false);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const classes = useStyles();

    const updateState = (state) => {
        let body = [];
        selectionModel.forEach(id => {
            body.push({
                id: id,
                type: type
            })
        })
         console.log(body)
         deleteItem({
            "data": body
        }).then(res=>{
            let url = '/trash?msg=Item permanently deleted.';
            window.location.href = type ==='product'? `${url}`
            : `${url}&categories=true`
        })
      }
    const tableColumns = [
        // { field: "sku", headerName: "SKU", width: 100 },
        { 
            field: "name",
            headerName: "Name",
            width: 480,
            renderCell: (params) => (
                <Tooltip title={params.row.name} >
                    <span className="table-cell-trucate">{params.row.name}</span>
                </Tooltip>
            ),
        },
        {
            field: "type",
            headerName: "Type",
            width: 230,
            renderCell: (params) => (
                <span className="table-cell-trucate">{params.row.type}</span>
            ),
        },
        // {
        //     field: "description",
        //     headerName: "Description",
        //     width: 230,
        //     renderCell: (params) => {
        //         return (
        //             <div className="rowitem">{params.row.seo?.description}</div>
        //         )
        //     },
        // },
        // {
        //     field: "keywords",
        //     headerName: "Keywords",
        //     width: 230,
        //     renderCell: (params) => {
        //         return (
        //             <div className="rowitem">{params.row.seo?.keywords}</div>
        //         )
        //     },
        // }
    ];
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            width: 200,
            disableColumnFilter: true,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Button
                            disabled={access.product_edit ? false : true}
                            onClick={() => {
                                restoreItem({
                                    "data": [
                                        {
                                            "id": params.row.id,
                                            "type": type
                                        }
                                    ]
                                }).then(res=>{
                                    window.location.href = type ==='product'? '/products?msg=Product restored'
                                    : '/categories?msg=Item restored '
                                })
                            }}
                            variant="outlined" color="success" size="small">
                            Restore
                        </Button>
                        <Button
                            disabled={access.subcategory_delete ? false : true}
                            onClick={() => {
                                deleteItem({
                                    "data": [
                                        {
                                            "id": params.row.id,
                                            "type": type
                                        }
                                    ]
                                }).then(res=>{
                                    let url = '/trash?msg=Item permanently deleted.';
                                    window.location.href = type ==='product'? `${url}`
                                    : `${url}&categories=true`
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
        
        <div className="datatable" style={{ height: '87%' }}>
        <div >
        <ToastContainer icon={false} limit={1} autoClose={2000} />
        <Stack direction="row" spacing={2} sx={{ py: 2 }} style={{ display: multiActionVisibility ? 'block' : 'none' } }>
          <Button
            onClick={() => {
              updateState(state_enum.trashed)
            }}
            disabled={access.category_delete ? false : true}
            variant="outlined" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Stack>
      </div>
            {data && <DataGrid
                className={classes.root}
                disableSelectionOnClick
                disableColumnSelector
                rows={data}
                columns={tableColumns.concat(actionColumn)}
                pageSize={10}
                checkboxSelection
                rowsPerPageOptions={[10]}
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
    )
}
export default TrashDatatable;