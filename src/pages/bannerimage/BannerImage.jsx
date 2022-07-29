import * as React from "react";
import * as api from "../../api";

import { state_enum } from "../../config";
import { toast } from "react-toastify";
import { useForm, Form } from "../../components/form/useForm";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { mandatoryTheam } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { Button, Stack, TextField, IconButton } from "@mui/material";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import "react-toastify/dist/ReactToastify.css";
import "./new.scss";
import Unauthorized from "../../utils/unauthorized";

//image
const initialFormValues = {
  images: [],
};
const BannerImage = (props) => {
  const [images, setImages] = useState([
    { id: uuidv4(), imgName: "", alttag: "", url: "" },
  ]);

  const validate = (fieldValues = values, state) => {
    let temp = { ...errors };
    //validate image field
    console.log('fieldValues',fieldValues)
    if (fieldValues?.images?.length === 0)
      temp.images = "This field is required.";
    else {
      temp.images = "";

      fieldValues?.images?.forEach((item, index) => {
        if (item.url === "") temp.images = "Please Upload the Image.";
        if (item.alttag === "") temp.images = "Please Enter the Alt Tag.";
      });
    }

    setErrors({
      ...temp,
    });
console.log(temp)
    if (fieldValues === values) {
      let validated = Object.values(temp).every((x) => x === "");
      if (!validated) {
        toast.error("Validation errors", {
          autoClose: 9000,
          pauseOnHover: true,
        });
        return false;
      } else {
        return true;
      }
    }
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFormValues, true, validate);

  const handleImageAdd = (id, event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("myFile", event.target.files[0]);
    api
      .uploadFile(data)
      .then((response) => {
        const new_values = [...images];
        let img = new_values.find((value) => value.id === id);

        img.url = response.data.url;
        img.imgName = event.target.files[0].name;
        setImages(new_values);
        setValues({ ...values, images: new_values });
        handleInputChange({
          target: {
            name: "images",
            value: new_values,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const AddAnotherImagesSection = () => {
    if (images.length > 4) {
      toast.error("You Can add only five Banner Images.", {
        autoClose: 9000,
        pauseOnHover: true,
      });
      return null;
    }

    setImages([
      ...images,
      {
        id: uuidv4(),
        imgName: "",
        alttag: "",
        url: "",
      },
    ]);
  };

  const handleImageData = (id, event) => {
    const newInputFields = images.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setImages(newInputFields);
    setValues({ ...values, images: newInputFields });
    handleInputChange({
      target: {
        name: "images",
        value: newInputFields,
      },
    });
  };

  const handleRemoveImages = (id) => {
    const new_values = [...images];
    new_values.splice(
      new_values.findIndex((value) => value.id === id),
      1
    );

    setImages(new_values);
    setValues({ ...values, images: new_values });
    handleInputChange({
      target: {
        name: "images",
        value: new_values,
      },
    });
  };
 
  useEffect(() => {
    api
    .fetchBanners()
    .then((response) => {

      setImages(response.data.images);
      setValues({ ...values, images: response.data.images });
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  
  }, []);

  const submitForm = async function (state) {
    if (validate(values, state)) {
      let body = {
        images: images,
      };

      try {
        await api.createBanner(body)
        .then((res)=>{
          toast.success("Banner Image Added Succesfully.", {
            autoClose: 9000,
            pauseOnHover: true,
          });
          
       }).catch((err)=>{
          Unauthorized(err);
          toast.error(err.response.data.message, {
            autoClose: 9000,
            pauseOnHover: true,
          });
       })

      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 9000,
          pauseOnHover: true,
        });
      }
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="form-container">
          <h1>{props.title}</h1>
          <Form>
            <ThemeProvider theme={mandatoryTheam}>
              <h3>
                Images{" "}
                {errors.images && (
                  <span className="error">{errors.images}</span>
                )}
              </h3>
              {images.map((inputField) => (
                <div key={inputField.id}>
                  {inputField.imgName && (
                    <div>
                      Image name: {inputField.imgName}
                      <IconButton
                        onClick={() => {
                          console.log(images, inputField.id);
                          let currentImg = images.filter(
                            (image) => image.id === inputField.id
                          );
                          currentImg[0].imgName = "";
                          currentImg[0].url = "";

                          setImages(images);
                          setValues({ ...values, images: images });
                          console.log(images);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                  {!inputField.imgName && (
                    <>
                      <input
                        type="file"
                        id="myFile"
                        onChange={(event) =>
                          handleImageAdd(inputField.id, event)
                        }
                        style={{ display: "none" }}
                      />
                      <label htmlFor="myFile" className="upload-file">
                        Select File <span style={{ color: "red" }}>*</span>
                      </label>
                      <br />
                      <br />
                    </>
                  )}
                  <TextField
                    required
                    name="alttag"
                    label="Alt Tag"
                    variant="standard"
                    value={inputField.alttag}
                    style={{ marginRight: "12px" }}
                    onChange={(event) => handleImageData(inputField.id, event)}
                  />
                <div>
                  {inputField.url && (
                    <a href={inputField.url} rel="noreferrer" target="_blank">
                      <img
                        src={inputField.url}
                        alt="product img"
                        style={{
                          height: "100px",
                          width: "100px",
                          border: "1px solid #B1B1B1",
                          padding: "3px",
                        }}
                      />
                    </a>
                  )}
                  <IconButton
                    disabled={images.length === 1}
                    onClick={() => handleRemoveImages(inputField.id)}
                  >
                    <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />}>
                     Delete
                    </Button>
             
                  </IconButton>
                  <IconButton onClick={AddAnotherImagesSection}>
                  <Button variant="outlined" endIcon={<AddIcon />}>
                    Add
                   </Button>
                  </IconButton>
                  </div>
                  <br />
                  <br />
                  <br />
                </div>
              ))}
            </ThemeProvider>

            <Stack
              direction="row"
              spacing={2}
              style={{ marginLeft: "8px", marginTop: "21px" }}
            >
              <Button
                onClick={() => {
                  submitForm(state_enum.saved);
                }}
                variant="contained"
                color="warning"
              >
                Save
              </Button>
            </Stack>
          </Form>

          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default BannerImage;
