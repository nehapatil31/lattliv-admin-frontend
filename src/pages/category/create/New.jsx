import * as access from "../../../access";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useForm, Form } from "../../../components/form/useForm";
import Controls from "../../../components/form/Controls";
import { toast } from "react-toastify";
import { Button, Stack, TextField } from "@mui/material";
import * as React from "react";
import * as api from "../../../api";
import "./new.scss";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { state_enum } from "../../../config";
import { ThemeProvider } from "@mui/material/styles";
import { mandatoryTheam, mandatoryLabel } from "../../../utils";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Unauthorized from "../../../utils/unauthorized";
const initialFormValues = {
  name: "",
  image:{
    alttag: '',
    imgName:'',
    url: '',
  },
  seo: {
    title: "",
    description: "",
    keywords: "",
    webDesc: "",
  },
};

const NewCategory = (props) => {
  const { categoryId } = useParams();
  const [editorState, setEditorState] = React.useState("");
  const [images, setImages] = React.useState({
    imgName: "",
    alttag: "",
    url: "",
  });

  const validate = (fieldValues = values, state) => {
    console.log('fieldValues',fieldValues)
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ('image' in fieldValues)
      temp.image = fieldValues?.image?.url ? "" : "This field is required."
    if ('image' in fieldValues)
      temp.alttag = fieldValues?.image?.alttag ? "" : "This field is required."
    if (state === 2 || state === 6 || state === undefined) {
      if (fieldValues?.seo?.title !== undefined && "title" in fieldValues?.seo)
        temp.title = fieldValues.seo.title ? "" : "This field is required.";
      if (fieldValues?.seo?.description !== undefined)
        temp.description = fieldValues.seo.description
          ? ""
          : "This field is required.";
      if (fieldValues?.seo?.keywords !== undefined)
        temp.keywords = fieldValues.seo.keywords
          ? ""
          : "This field is required.";

    }

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const setEditorValues = function (dataObj) {
    let content1 = dataObj?.seo?.webDesc ? dataObj?.seo?.webDesc : "";
    setEditorState(() => {
      const blocksFromHTML = convertFromHTML(content1);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState);
    });
  };
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFormValues, true, validate);

  const handleImageAdd = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("myFile", event.target.files[0]);
    api
      .uploadFile(data)
      .then((response) => {
        handleInputChange({
          target: {
            name: 'image',
            value: {
              ...values.image,
              imgName: event.target.files[0].name,
              url: response.data.url
            }
          }
        })
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
        console.log(values);
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
    if (categoryId) {
      api
        .fetchCategory(categoryId)
        .then((response) => {
          setValues(response.data);
          setEditorValues(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const submitForm = async function (state) {
    if (validate(values, state)) {
      try {
        let body = {
          ...values,
          state: state,
          ...(state === 1 && { createdBy: access.user_id }),
          ...(state === 2 && { approvedBy: access.user_id }),
        };
        if (categoryId) {
          delete body?.parent;
          await api.updateCategory(categoryId, body)
            .then((res)=>{
                let msg = "Category is updated !";
                window.location.href = "/categories?msg=" + msg;
                
            }).catch((err)=>{
              Unauthorized(err);
              toast.error(err.response.data.message, {
                autoClose: 9000,
                pauseOnHover: true,
              });
            })

        } else {
          body.createdBy = access.user_id;
          await api.createCategory(body)
              .then((res)=>{
                let msg = "Category is created !";
                window.location.href = "/categories?msg=" + msg;
                
            }).catch((err)=>{
              Unauthorized(err);
              toast.error(err.response.data.message, {
                autoClose: 9000,
                pauseOnHover: true,
              });
            })

        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          autoClose: 9000,
          pauseOnHover: true,
        });
      }
    }
  };

  const onEditorChange = (editorState) => {
    let new_values = JSON.parse(JSON.stringify(values));

    new_values.seo.webDesc = stateToHTML(editorState.getCurrentContent());
    handleInputChange({
      target: {
        name: "seo",
        value: {
          webDesc: new_values.seo.webDesc,
        },
      },
    });
    setValues({ ...new_values });
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
                label="Category Name"
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}
              />

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
              <h3>SEO Metatags</h3>
              <Controls.Input
                name="title"
                error={errors.title}
                label={mandatoryLabel('Title')}
                value={values.seo.title}
                onChange={(e) => {
                  let { name, value } = e.target;
                  let new_values = JSON.parse(JSON.stringify(values));
                  new_values.seo[name] = value;
                  handleInputChange({
                    target: {
                      name: "seo",
                      value: {
                        title: value,
                      },
                    },
                  });
                  setValues({
                    ...new_values,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{color: values.seo.title.length > 56 ? 'red' :'black'}}>
                    {values.seo.title.length}
                    </InputAdornment>
                  ),
                }}
              />

              <Controls.Input
                name="description"
                label={mandatoryLabel('Description')}
                value={values.seo.description}
                error={errors.description}
                onChange={(e) => {
                  let { name, value } = e.target;
                  let new_values = JSON.parse(JSON.stringify(values));
                  new_values.seo[name] = value;
                  handleInputChange({
                    target: {
                      name: "seo",
                      value: {
                        description: value,
                      },
                    },
                  });
                  setValues({
                    ...new_values,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{color: values.seo.description.length > 156 ? 'red' :'black'}}>
                    {values.seo.description.length}
                    </InputAdornment>
                  ),
                }}
              />
              <Controls.Input
                name="keywords"
                error={errors.keywords}
                label={mandatoryLabel('Keywords')}
                value={values.seo.keywords}
                onChange={(e) => {
                  let { name, value } = e.target;
                  let new_values = JSON.parse(JSON.stringify(values));

                  new_values.seo[name] = value;
                  handleInputChange({
                    target: {
                      name: "seo",
                      value: {
                        keywords: value,
                      },
                    },
                  });
                  setValues({
                    ...new_values,
                  });
                }}
              />
              <div className="web-desc" style={{ display: "flex" }}>
                <h3 style={{ marginLeft: "8px" }}>Website Description </h3>
                {/* <p style={{ color: "red" }}>**</p> */}
                {/* {errors.webDesc && (
                  <p
                    className="error"
                    style={{ color: "red", margin: "20px 20px" }}
                  >
                    {errors.webDesc}
                  </p>
                )} */}
              </div>

              <Editor
               wrapperStyle={{ border: "1px solid #ddd", height: "100%", margin: "8px", width: "80%"}}
               editorStyle={{ padding: "10px" , minHeight: "150px" }}
                // editorState={editorState}
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => {
                  setEditorState(editorState);
                }}
                onChange={() => onEditorChange(editorState)}
              />
            </ThemeProvider>
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
               On Ready For Review and Publish <strong>Double ** </strong> are mandatory field
            </Alert>
          </Stack>
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
              <Button
                onClick={() => {
                  submitForm(state_enum.review);
                }}
                variant="contained"
                color="info"
              >
                Ready for review
              </Button>
              <Button
                onClick={() => {
                  submitForm(state_enum.published);
                }}
                variant="contained"
                color="success"
              >
                Publish
              </Button>
              <Button
                onClick={() => {
                  submitForm(state_enum.hidden);
                }}
                variant="contained"
                color="error"
              >
                Hide
              </Button>
            </Stack>
          </Form>
          {/* <Button
            onClick={() => {
              submitForm()
            }}
            variant="contained" color="info">
            Submit
          </Button> */}
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
