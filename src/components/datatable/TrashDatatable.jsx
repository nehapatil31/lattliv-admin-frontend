import "./datatable.scss";
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import * as access from '../../access'
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { deleteItem, restoreItem } from "../../api";

const TrashDatatable = ({ data, type }) => {
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
                                    window.location.href = type=='product'? '/products?msg=Product restored'
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
                                    window.location.href = type=='product'? `${url}`
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
            {data && <DataGrid
                className="datagrid"
                disableSelectionOnClick
                disableColumnSelector
                rows={data}
                columns={tableColumns.concat(actionColumn)}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />}
        </div>
    )
}
export default TrashDatatable;