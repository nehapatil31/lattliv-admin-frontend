import "./datatable.scss";
import URL from '../../config'
import { useState,useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";

const ProductDatatable = () => {
  const [data, setData] = useState();

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetch(`${URL.base_url}/products`)
      .then(results => results.json())
      .then(data => {
        setData(data);
      });
  }, []);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        let url = `/products/${params.id}`
        return (
          <div className="cellAction">
            <Link to={url} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
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
      
      {data && <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />}
    </div>
  );
};

export default ProductDatatable;
