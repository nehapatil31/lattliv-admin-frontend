import * as api from "../../../api";
import * as access from "../../../access";
import "./new.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { Grid, Button ,TextField} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm, Form } from "../../../components/form/useForm";
import Controls from "../../../components/form/Controls";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { mandatoryTheam } from "../../../utils";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const initialFormValues = {
    name: "",
    place: "",
    address: "",
    email: "",
    number: '',
    manager: "",
    map: "",
    timings: "",
    image:{
        alttag: '',
        imgName:'',
        url: '',
      },
};

const NewStore = (props) => {
    const [file, setFile] = useState("");
    const { storeId } = useParams();
    const [images, setImages] = useState({ imgName: "", alttag: "", url: "" });
    const validate = (fieldValues = values) => {
        console.log(fieldValues)
        let temp = { ...errors };
        if ("name" in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required.";
        if ("place" in fieldValues)
            temp.place = fieldValues.place ? "" : "This field is required.";
        // if ("number" in fieldValues)
        //     temp.number = fieldValues.number ? "" : "This field is required.";
        if ("address" in fieldValues)
            temp.address = fieldValues.address ? "" : "This field is required.";
        if ("email" in fieldValues) {
            temp.email = fieldValues.email ? "" : "This field is required.";
            if (fieldValues.email) {
                var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                temp.email = EMAIL_REGEX.test(fieldValues.email)
                    ? ""
                    : "Email is not valid.";
            }
        }
        if ('image' in fieldValues)
            temp.alttag = fieldValues?.image?.alttag ? "" : "This field is required."
        if ('image' in fieldValues)
            temp.image = fieldValues?.image?.url ? "" : "This field is required."

        if ("map" in fieldValues)
            temp.map = fieldValues.map ? "" : "This field is required.";
        if ("timings" in fieldValues)
            temp.timings = fieldValues.timings ? "" : "This field is required.";
        setErrors({
            ...temp,
        });
        console.log(temp)
        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFormValues, true, validate);

    const handleImageAdd = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("myFile", event.target.files[0]);
        api.uploadFile(data)
            .then((response) => {
                setValues({
                    ...values,
                    image: {
                        alttag: '',
                        imgName: event.target.files[0].name,
                        url: response.data.url,
                    },
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleImageData = (event) => {
        //get alt tag and name
        const alttag = event.target.value;
        handleInputChange({
          target: {
            name: 'image',
            value: {
              ...values.image,
              alttag: alttag,
            },
          }
        })
        setValues({
          ...values,
          image: {
            ...values.image,
            alttag: alttag,
          },
        });
      };

    useEffect(() => {
        if (storeId) {
            //get store data
            api.fetchStore(storeId)
                .then((response) => {
                    let dataObj = { ...response.data };
                    console.log(dataObj);
                    setValues(dataObj);
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.message, {
                        autoClose: 9000,
                        pauseOnHover: true,
                    });
                });
        }
    }, []);
    const submitForm = async function (state) {
        try {
            if (validate()) {
                let body = {
                    ...values,
                };

                if (storeId) {
                    body.id = storeId;
                    const response = await api.updateStore(storeId,body);
                    console.log(response);
                    if (response.status === 200) {
                        let msg = "Store is updated !";

                        window.location.href = "/stores?msg=" + msg;
                    } else {
                        toast.error(response, {
                            autoClose: 9000,
                            pauseOnHover: true,
                        });
                    }
                } else {
                    const response = await api.createStore(body);
                    console.log(response);
                    if (response.status === 200) {
                        let msg = "Store is created !";

                        window.location.href = "/stores?msg=" + msg;
                    } else {
                        toast.error(response, {
                            autoClose: 9000,
                            pauseOnHover: true,
                        });
                    }
                }
            }
        } catch (error) {
            toast.error(error.response.data.message, {
                autoClose: 9000,
                pauseOnHover: true,
            });
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{props.title}</h1>
                </div>
                <ToastContainer icon={false} autoClose={3000} />
                <div className="bottom">
                    <div className="right">
                        <Form>
                            <ThemeProvider theme={mandatoryTheam}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Controls.Input
                                            required
                                            name="name"
                                            label="Name"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.name}
                                        />

                                        <Controls.Input
                                            required
                                            name="place"
                                            label="Location"
                                            value={values.place}
                                            onChange={handleInputChange}
                                            error={errors.place}
                                        />
                                        <Controls.Input
                                            required
                                            name="address"
                                            label="Address"
                                            value={values.address}
                                            onChange={handleInputChange}
                                            error={errors.address}
                                        />
                                        <Controls.Input
                                            required
                                            name="map"
                                            label="Map link"
                                            value={values.map}
                                            onChange={handleInputChange}
                                            error={errors.map}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controls.Input
                                            required
                                            name="email"
                                            label="Email"
                                            value={values.email}
                                            onChange={handleInputChange}
                                            error={errors.email}
                                        />
                                        <Controls.Input
                                            name="manager"
                                            label="Manager name"
                                            value={values.manager}
                                            onChange={handleInputChange}
                                        />
                                        <Controls.Input
                                            
                                            name="number"
                                            label="Telephone Number"
                                            value={values.number}
                                            onChange={handleInputChange}
                                            error={errors.number}
                                        />
                                        <Controls.Input
                                            required
                                            name="timings"
                                            label="timings"
                                            value={values.timings}
                                            onChange={handleInputChange}
                                            error={errors.timings}
                                        />
                                    </Grid>
                                </Grid>

                                <br />
                                {/* <div className="image-container">
                                    <input
                                        type="file"
                                        id="myFile"
                                        onChange={(event) =>
                                            handleImageAdd(event)
                                        }
                                        style={{ display: "none" }}
                                    />
                                    <label for="myFile" className="upload-file">
                                        Select File{" "}
                                    </label>
                                    {values?.image?.url && (
                                        <div className="img-details">
                                            <a
                                                href={values.image.url}
                                                rel="noreferrer"
                                                target="_blank"
                                                style={{ position: "relative" }}
                                            >
                                                <img
                                                    src={values.image.url}
                                                    alt={values.image.alttag}
                                                    style={{
                                                        height: "100px",
                                                        width: "100px",
                                                        border: "1px solid #B1B1B1",
                                                        padding: "3px",
                                                    }}
                                                />
                                            </a>
                                            {values.image.imgName && (
                                                <div
                                                    className="image-label"
                                                    style={{ color: "#000000" }}
                                                >
                                                    {values.image.imgName}
                                                    <IconButton
                                                        onClick={() => {
                                                            setValues({
                                                                ...values,
                                                                image: {
                                                                    alttag: "",
                                                                    imgName: "",
                                                                    url: "",
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            )}
                  
                                        </div>
                                    )}
                                
                                </div>
                                <div className="altTag">
                                    <TextField
                                        
                                        name="alttag"
                                        label="Alt Tag"
                                        variant="standard"
                                        value={values?.image.alttag}
                                        style={{ marginRight: "12px" }}
                                        onChange={(event) => handleImageData(event)}
                                    />

                                    </div> */}



              <div className="image-container">
                <input
                  type="file"
                  id="myFile"
                  onChange={(event) => handleImageAdd(event)}
                  style={{ display: "none" }}
                />
                <label for="myFile" className="upload-file">
                  Select File <span style={{ color: "red" }}>*</span>
                </label>
                {/* error msg */}

                {values?.image?.url && (
                  <div className="img-details">
                  <a href={values.image.url} rel="noreferrer" target="_blank">
                    <img
                      src={values.image.url}
                      alt={values.image.alttag}
                      style={{
                        height: "100px",
                        width: "100px",
                        border: "1px solid #B1B1B1",
                        padding: "3px",
                      }}
                    />
                  </a>
                   {values.image.imgName && (
                    <div
                        className="image-label"
                        style={{ color: "#000000" }} 
                    >
                        {values.image.imgName}
                        <IconButton
                            onClick={() => {
                                setValues({
                                    ...values,
                                    image: {
                                        alttag: "",
                                        imgName: "",
                                        url: "",
                                    },
                                });
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                  )}
                 </div>
                  
                )}
              </div>
              <div className="errror-container">
                {errors.image && <span className="error">{errors.image}</span>}
              </div>

            <div className="altTag">
              <TextField
                required
                name="alttag"
                label="Alt Tag"
                variant="standard"
                value={values?.image.alttag}
                style={{ marginRight: "12px" }}
                onChange={(event) => handleImageData(event)}
              />

            </div>
            {errors.alttag && <span className="error" style={{margin:'9px'}}>{errors.alttag}</span>}

              <br />

                                <br />
                                <br />
                                <Button
                                    onClick={() => {
                                        submitForm();
                                    }}
                                    style={{ marginLeft: "12px" }}
                                    variant="contained"
                                    color="info"
                                >
                                    {storeId ? "Update Location" : "Create New Location"}
                                </Button>
                            </ThemeProvider>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewStore;
