import * as React from "react";
import * as api from "../../../api";
import { useParams } from "react-router-dom";
import { state_enum } from "../../../config";
import { toast } from "react-toastify";
import { useForm, Form } from "../../../components/form/useForm";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { mandatoryTheam } from "../../../utils";
import { Button, Stack, TextField } from "@mui/material";

import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Controls from "../../../components/form/Controls";

import "react-toastify/dist/ReactToastify.css";
import "./new.scss";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { ListSubheader, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Unauthorized from "../../../utils/unauthorized";
const initialFormValues = {
  tag: "",
  name: "",
  image: {
    alttag: "",
    imgName: "",
    url: "",
  },
  type: "Product",
  comics: [],
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Types = [
  {
    id: "Product",
    name: "Product",
  },
  {
    id: "Comic",
    name: "Comic",
  },
];

const NewCustomSectionImage = (props) => {
  const { customsectionimageId } = useParams();

  const [tags, setTags] = useState([]);
  const [comic, setComic] = React.useState([]);
  const [allComic, setAllComic] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const [images, setImages] = React.useState({
    imgName: "",
    alttag: "",
    url: "",
  });
  const validate = (fieldValues = values, state) => {
    let temp = { ...errors };

    if (fieldValues.name === "") {
      temp.name = "Custom Section  Name is required";
    } else {
      temp.name = "";
    }

    if (fieldValues.tag === "" && fieldValues.type === "Product") {
      temp.tag = "Tag is required";
    } else {
      temp.tag = "";
    }

    if ("image" in fieldValues)
      temp.image = fieldValues?.image?.url ? "" : "This field is required.";
    if ("image" in fieldValues)
      temp.alttag = fieldValues?.image?.alttag ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setComic(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    //seting the value comic value
    setValues({
      ...values,
      comics: value,
    });
  };

  useEffect(() => {
    api
      .fetchTags()
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .fetchComics()
      .then((response) => {
        setAllComic(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {

    if (customsectionimageId) {
      api
        .fetchSectionImage(customsectionimageId)
        .then((response) => {
          console.log("customsectionimage", response.data);
          setValues({
            ...values,
            name: response.data.name,
            tag: response.data?.tag?.id,
            image: response.data.image,
			...(response.data.comics.length > 0 ? {
					type: "Comic",
				}: {
					type: "Product",
				}
				)
          });
          setImages(response.data.image);
		  let new_comic = [];
		  response.data.comics.forEach((comic)=>{
			new_comic.push(comic.id)
		  })
          setComic(new_comic);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [customsectionimageId]);
  const handleImageAdd = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("myFile", event.target.files[0]);
    api
      .uploadFile(data)
      .then((response) => {
        handleInputChange({
          target: {
            name: "image",
            value: {
              ...values.image,
              imgName: event.target.files[0].name,
              url: response.data.url,
            },
          },
        });
        setImages({
          imgName: event.target.files[0].name,
          alttag: "",
          url: response.data.url,
        });

        setValues({
          ...values,
          image: {
            ...values.image,
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
        name: "image",
        value: {
          ...values.image,
          alttag: alttag,
        },
      },
    });
    setValues({
      ...values,
      image: {
        ...values.image,
        alttag: alttag,
      },
    });
  };

  const submitForm = async function (state) {
    if (validate(values, state)) {
		if(values.type === "Product" && values.tag === ''){
			toast.error("Tag is required", {
				autoClose: 9000,
				pauseOnHover: true,
			});
			return  false;

		}

		if(values.type === "Comic" && values.comics === ''){
			toast.error("Comic is required", {
				autoClose: 9000,
				pauseOnHover: true,
			});
			return  false;
		}
      let body = {
        name: values.name,
        image: values.image,
        type: values.type,
		...(values.type === "Product") && {tag: values.tag},
		...(values.type === "Comic") && {comics: values.comics}
      };

      try {
		if(customsectionimageId){
			await api
			.updateSection(customsectionimageId,body)
			.then((res) => {
			  let msg = "Custom Section Image Updated Succesfully."
  
			  window.location.href = "/custom-section-image?msg=" + msg;
			})
			.catch((err) => {
			  Unauthorized(err);
			  toast.error(err.response.data.message, {
				autoClose: 9000,
				pauseOnHover: true,
			  });
			});

		}else{
			await api
			.section(body)
			.then((res) => {
				let msg = "Custom Section Image Added Succesfully."
				window.location.href = "/custom-section-image?msg=" + msg;
			})
			.catch((err) => {
			  Unauthorized(err);
			  toast.error(err.response.data.message, {
				autoClose: 9000,
				pauseOnHover: true,
			  });
			});
		}
	

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
              <Controls.Input
                required
                name="name"
                label="Custom Section Name"
                value={values.name}
                error={errors.name}
                onChange={handleInputChange}
              />

              <Controls.Select
                name="type"
                label="Type"
                error={errors.type}
                value={values.type}
                onChange={handleInputChange}
                options={Types}
                required
              />

              {values.type === "Product" && (
                <Controls.Select
                  name="tag"
                  label="Tag"
                  error={errors.tag}
                  value={values.tag}
                  onChange={handleInputChange}
                  options={tags}
                  required
                />
              )}

              <h4>
                Images{" "}
                {errors.images && (
                  <span className="error">{errors.images}</span>
                )}
              </h4>
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
                      <div className="image-label" style={{ color: "#000000" }}>
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
              {errors.alttag && (
                <span className="error" style={{ margin: "9px" }}>
                  {errors.alttag}
                </span>
              )}

              {values.type === "Comic" && (
                <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Comic
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={comic}
                    onChange={handleChange}
                    input={<OutlinedInput label="Comic" />}
                    //  renderValue={(selected) => selected.join(", ")}
                    renderValue={(selected) => {
                      let newSelected = [];
                      selected.forEach((item) => {
                        allComic.filter((newComic) => {
                          if (newComic.id === item) {
                            newSelected.push(newComic.name);
                          }
                        });
                      });

                      return newSelected.join(", ");
                    }}
                    MenuProps={MenuProps}
                  >
                    <ListSubheader>
                      <TextField
                        size="small"
                        // Autofocus on textfield
                        autoFocus
                        placeholder="Type to search..."
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          return setSearchText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== "Escape") {
                            e.stopPropagation();
                          }
                        }}
                      />
                    </ListSubheader>

                    {searchText.length > 0
                      ? allComic
                          .filter((item) => {
                            return item.name
                              .toLowerCase()
                              .includes(searchText.toLowerCase());
                          })
                          .map((item) => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                <ListItemText primary={item.name} />
                              </MenuItem>
                            );
                          })
                      : allComic.map((item) => {
                          return (
                            <MenuItem key={item.id} value={item.id}>
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          );
                        })}
                  </Select>
                </FormControl>
              )}
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

export default NewCustomSectionImage;
