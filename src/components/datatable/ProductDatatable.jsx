import * as access from "../../access";
import "./datatable.scss";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialog from "../confirm/ConfirmDialog";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GradingIcon from "@mui/icons-material/Grading";
import CheckIcon from "@mui/icons-material/Check";
import Stack from "@mui/material/Stack";
import { url, state_enum } from "../../config";
import * as api from "../../api";
import { useStyles } from "../../utils";

const ProductDatatable = () => {
  const [data, setData] = useState();
  const classes = useStyles();
  const [confirmOpen, setConfirmOpen] = useState({ state: false, id: "" });
  const [multiActionVisibility, setMultiActionVisibility] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleDelete = () => {
    let body = {
      state: state_enum.trashed,
      deleted_by: access.user_id,
    };

    api
      .updateProduct(confirmOpen.id, body) 
      .then((response) => {
        if (response.status === 200) {
          let msg = "Product is deleted.";

          window.location.href = "/products?msg=" + msg;
        } else {
          toast.error("Some error occurred", {
            autoClose: 9000,
            pauseOnHover: true,
          });
        }
      })
      .catch((error) => {
        toast.error("Some error occurred", {
          autoClose: 9000,
          pauseOnHover: true,
        });
      });
  };

  const updateState = (state) => {
    let body = {
      ids: selectionModel,
      state: state,
      type: "product",
    };
    api
      .updateBulk(body) 
      .then((response) => {
        if (response.status === 200) {
          let msg = "Products are updated.";

          window.location.href = "/products?msg=" + msg;
        } else {
          toast.error("Some error occurred", {
            autoClose: 9000,
            pauseOnHover: true,
          });
        }
      })
      .catch((error) => {
        toast.error("Some error occurred", {
          autoClose: 9000,
          pauseOnHover: true,
        });
      });
  };
  useEffect(() => {
    api
      .fetchProducts() 
      .then((response) => {
        if (response.status === 200) {
          let data = response.data;
          let serial = 1;
          data.forEach((element) => {
            element.serial = serial;
            serial++;
          });
          console.log('data',data)
          setData(data);
        } else {
          toast.error("Some error occurred", {
            autoClose: 9000,
            pauseOnHover: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status === 401) {
          toast.error("Session Expired. Please Login Again", {
            autoClose: 9000,
            pauseOnHover: true,
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
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
        let apiUrl = `/products/${params.id}`;
        return (
          <div className="cellAction">
            <Button
              disabled={access.product_edit ? false : true}
              onClick={() => {
                window.location.href = apiUrl;
              }}
              variant="outlined"
              color="info"
              size="small"
            >
              Edit
            </Button>

            <Button
              disabled={access.product_delete ? false : true}
              onClick={(e) => {
                e.preventDefault();
                setConfirmOpen({
                  state: true,
                  id: params.row.id,
                });
              }}
              variant="outlined"
              color="error"
              size="small"
            >
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
        Are you sure you want to delete this product?
      </ConfirmDialog>
      <ToastContainer icon={false} limit={1} autoClose={2000} />
      <div>
        <Stack
          direction="row"
          spacing={2}
          style={{ display: multiActionVisibility ? "block" : "none" }}
        >
          <Button
            onClick={() => {
              updateState(state_enum.trashed);
            }}
            disabled={access.product_delete ? false : true}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            disabled={access.product_edit ? false : true}
            onClick={() => {
              updateState(state_enum.review);
            }}
            variant="outlined"
            color="info"
            startIcon={<GradingIcon />}
          >
            Ready for review
          </Button>
          <Button
            disabled={access.product_hide ? false : true}
            onClick={() => {
              updateState(state_enum.hidden);
            }}
            variant="outlined"
            color="warning"
            startIcon={<VisibilityOffIcon />}
          >
            Hide
          </Button>
          <Button
            disabled={access.product_publish ? false : true}
            onClick={() => {
              updateState(state_enum.published);
            }}
            variant="outlined"
            color="success"
            startIcon={<CheckIcon />}
          >
            Publish
          </Button>
        </Stack>
      </div> 
      <br />
      {data && (
        <DataGrid
          className={classes.root}
          disableSelectionOnClick
          disableColumnSelector
          rows={data}
          columns={userColumns.concat(actionColumn)}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel, a) => {
            if (newSelectionModel.length) {
              setMultiActionVisibility(true);
            } else {
              setMultiActionVisibility(false);
            }
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
        />
      )}
    </div>
  );
};

export default ProductDatatable;
