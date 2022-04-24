import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="img-container">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              {/* <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div> */}

              {/* {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input type={input.type} placeholder={input.placeholder} />
                </div>
              ))} */}
              <TextField
                // onChange={onTextChange}
                // value={textValue}
                label={"SKU"} //optional
              />
              <TextField
                // onChange={onTextChange}
                // value={textValue}
                label={"URL"} //optional
              />
              <br />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="warning">
                  Save
                </Button>
                <Button variant="contained" color="info">
                  Ready for review
                  </Button>
                <Button variant="contained" color="success">
                  Publish
                  </Button>
                <Button variant="contained" color="error">
                  Hide
                  </Button>
              </Stack>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
