import "./datatable.scss";
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import * as access from '../../access'
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { useStyles } from "../../utils"
import { toast, ToastContainer } from "react-toastify";

const SeoDatatable = ({ data , type }) => {
    const classes = useStyles();
    const columns = () => {
        if(type === 'products'){
            return {
                field: "sku",
                headerName: "SKU",
                width: 100 
            }
        }
        if(type === 'categories'){
             return {
                field: "id",
                headerName: "ID",
                width: 100 
            }
        }
        if(type === 'subCategories'){
            return {
                field: "id",
                headerName: "ID",
                width: 100 
            }
        }

    }
          
    const tableColumns = [
        {
            field: "serial",
            headerName: "Sr. No.",
            width: 100
        },
        columns(),
        {
            field: "name",
            headerName: "Name",
            width: 200,
            renderCell: (params) => (
                <Tooltip title={params.row.name} >
                    <span className="table-cell-trucate">{params.row.name}</span>
                </Tooltip>
            ),
        },
        {
            field: "title",
            headerName: "Title",
            width: 200,
            renderCell: (params) => (
                <span className="table-cell-trucate">{params.row.seo?.title}</span>
            ),
        },
        {
            field: "description",
            headerName: "Description",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="rowitem">{params.row.seo?.description}</div>
                )
            },
        },
        {
            field: "keywords",
            headerName: "Keywords",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="rowitem">{params.row.seo?.keywords}</div>
                )
            },
        }
    ];
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            width: 100,
            disableColumnFilter: true,
            renderCell: (params) => {
                let page = 'seo';
                let apiUrl = `/products/${params.id}?page=${page}`
                return (
                    <div className="cellAction">
                        <Button
                            disabled={access.product_edit ? false : true}
                            onClick={() => {
                                window.location.href = apiUrl
                            }}
                            variant="outlined" color="info" size="small">
                            Edit
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="datatable" style={{height: '95%'}}>
            <ToastContainer icon={false} limit={1} autoClose={2000} />
            {data && <DataGrid
               className={classes.root}
                disableSelectionOnClick
                disableColumnSelector
                disableColumnMenu
                rows={data}
                columns={tableColumns.concat(actionColumn)}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />}
        </div>
    )
}
export default SeoDatatable;