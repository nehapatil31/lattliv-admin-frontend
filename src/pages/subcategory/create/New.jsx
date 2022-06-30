import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useForm, Form } from "../../../components/form/useForm";
import { url } from '../../../config'
import Controls from '../../../components/form/Controls'
import { toast, ToastContainer } from 'react-toastify';
import { Grid, Button, Stack, TextField, IconButton, Typography } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import * as React from 'react'
import * as api from '../../../api'
import './new.scss'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { state_enum } from '../../../config'
import * as access from '../../../access'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML} from "draft-js"
import { stateToHTML } from 'draft-js-export-html';
import { ThemeProvider } from '@mui/material/styles';
import { mandatoryTheam } from '../../../utils'
const initialFormValues = {
  name: '',
  parent: '',
  image : '',
  alttag:'',
  seo: {
    title: '',
    description: '',
    keywords: '',
    webDesc: '',
  }
}

const NewSubCategory = (props) => {
  const { subcategoryId } = useParams();
  const [categories, setCategories] = useState();
  const [editorState, setEditorState] = React.useState('')

  const validate = (fieldValues = values, state) => {

    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required."
    if ('image' in fieldValues)
      temp.image = fieldValues.image ? "" : "This field is required."
    if ('parent' in fieldValues)
      temp.parent = fieldValues.parent ? "" : "This field is required."
  
    if(state === 2  || state === 6 || state === undefined){
      if (fieldValues?.seo?.title !== undefined && 'title' in fieldValues?.seo)
        temp.title = fieldValues.seo.title ? "" : "This field is required."
      if (fieldValues?.seo?.description !== undefined)
        temp.description = fieldValues.seo.description ? "" : "This field is required."
      if (fieldValues?.seo?.keywords !== undefined)
        temp.keywords = fieldValues.seo.keywords ? "" : "This field is required."
      if (fieldValues?.seo?.webDesc !== undefined)
        temp.webDesc = (fieldValues.seo.webDesc === '<p><br></p>' || fieldValues.seo.webDesc ==='') ? "This field is required." : ""
    }

    setErrors({
      ...temp
    })
    console.log("fieldValues",fieldValues)
    console.log('values',values)
    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const setEditorValues = function (dataObj) {
    let content1 =  dataObj?.seo?.webDesc ?  dataObj?.seo?.webDesc : ''
    setEditorState(
      () => {
        const blocksFromHTML = convertFromHTML(content1)
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
        return EditorState.createWithContent(contentState)
      }
    )

  }
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues, true, validate);

  const handleImageAdd = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('myFile', event.target.files[0]);
    api.uploadFile(data)
      .then(response => {

        handleInputChange({
          target: {
            name: 'image',
            value: response.data.url
          }
        })
        setValues({
          ...values,
          image: {
            alttag:'',
            imgName: event.target.files[0].name,
            url: response.data.url
          }
        })

      }).catch(error => {
        console.log(error)
      });
  }

  const handleImageData = (event) => {
    //get alt tag and name
    const alttag = event.target.value;
    handleInputChange({
      target: {
        name: 'alttag',
        value: alttag
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

  }, []);
  useEffect(() => {
    api.fetchCategories()
      .then(response => {
        // let subcategories = response.data.filter((item) => item.parent)
        let categories = response.data.filter((item) => !item.parent)
        setCategories(categories);
        if (subcategoryId) {
          api.fetchCategory(subcategoryId)
            .then(response => {
              setValues(response.data);
              setEditorValues(response.data)
              console.log(response.data)
            }).catch(error => {
              console.log(error)
            });
        }
        // setSubCategories(subcategories);
      }).catch(error => {
        console.log(error)
      });
  }, [])

  const submitForm = async function (state) {

    if (validate(values, state)) {
      try {
        let body = {
          ...values,
          state: state,
          ...(state === 1) && {createdBy: access.user_id},
          ...(state === 2) && {approvedBy: access.user_id},
        }
        if (subcategoryId) {
          const response = await api.updateCategory(subcategoryId, body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Sub category is updated !"
  
            window.location.href = '/categories?subcategory=true&&msg=' + msg;
  
          } else {
            toast.error("Some error occurred",{
              autoClose: 9000,
              pauseOnHover: true,
            })
          }
        } else {
          const response = await api.createSubcategory(body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Subcategory is created !"
  
            window.location.href = '/categories?subcategory=true&&msg=' + msg;
  
          } else {
            toast.error("Some error occurred",{
              autoClose: 9000,
              pauseOnHover: true,
            })
          }
        }
      } catch (error) {
        console.log(error)
        toast.error("Some error occurred",{
          autoClose: 9000,
          pauseOnHover: true,
        })
      }
    }
  }

  const onEditorChange = (editorState) => {
    let new_values = JSON.parse(JSON.stringify(values));
  
    new_values.seo.webDesc = stateToHTML(editorState.getCurrentContent())
    handleInputChange({
      target: {
        name: 'seo',
        value: {
          'webDesc':  new_values.seo.webDesc,
        }
      }
    })
    setValues({...new_values})
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="form-container">
          <h1>{props.title}</h1>
          <Form>
          <ThemeProvider theme={mandatoryTheam}>

            {categories && (
              <Controls.Select
               required
                name='parent'
                error={errors.parent}
                label="Category"
                value={values.parent}
                onChange={(e) => {
                  handleInputChange(e)
                }}
                options={categories}
              />
            )}

            <Controls.Input
             required
              name='name'
              error={errors.name}
              label="Name"
              value={values.name}
              onChange={handleInputChange}
            />

            <div className='image-container'>
              <input type="file" id="myFile" onChange={event => handleImageAdd(event)}   style={{display: 'none' }} />
              <label for="myFile"  className='upload-file'>Select File  <span style={{color: "red" }}>*</span></label>
              {values?.image?.url && (
                  <a href={values.image.url} rel='noreferrer' target="_blank">
                    <img src={values.image.url} alt={values.image.alttag}  style={{ height: '100px', width: '100px', border: '1px solid #B1B1B1',padding: '3px' }} />
                    {values.image.imgName && <div className='image-label' style={{color:"#000000"}}> {values.image.imgName}</div>}
                  </a>
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
                value={values?.image?.alttag && values.image.alttag}
                style={{ marginRight: "12px" }}
                onChange={(event) => handleImageData(event)}
              />

            </div>
            {errors.alttag && <span className="error" style={{margin:'9px'}}>{errors.alttag}</span>}


            <h3>SEO Metatags</h3>
            <Controls.Input
              name='title'
              label="Title"
              value={values?.seo?.title}
              error={errors.title}
              onChange={(e) => {
                let { name, value } = e.target
                let new_values = JSON.parse(JSON.stringify(values));;
                new_values.seo[name] = value
                handleInputChange({
                  target: {
                    name: 'seo',
                    value: {
                      'title': value,
                    }
                  }
                })
                setValues({
                  ...new_values
                })
              }}
            />
            <Controls.Input
              name='description'
              label="Description"
              error={errors.description}
              value={values.seo?.description}
              onChange={(e) => {
                let { name, value } = e.target
                let new_values = JSON.parse(JSON.stringify(values));;
                new_values.seo[name] = value
                handleInputChange({
                  target: {
                    name: 'seo',
                    value: {
                      'description': value,
                    }
                  }
                })
                setValues({
                  ...new_values
                })
              }}
            />
            <Controls.Input
              name='keywords'
              label="Keywords"
              error={errors.keywords}
              value={values.seo?.keywords}
              onChange={(e) => {
                let { name, value } = e.target
                let new_values = JSON.parse(JSON.stringify(values));;
                new_values.seo[name] = value
                handleInputChange({
                  target: {
                    name: 'seo',
                    value: {
                      'keywords': value,
                    }
                  }
                })
                setValues({
                  ...new_values
                })
              }}
            />

              <div className='web-desc' style={{display:'flex'}}>
                <h3 style={{ marginLeft: '8px' }}>Website Description </h3><p style={{ color: 'red' }}>*</p>
                {errors.webDesc && <p  className='error' style={{ color: 'red', margin: '20px 20px' }}>{errors.webDesc}</p>}
              </div>

              
                <Editor
                  wrapperStyle={{ border: "1px solid #ddd", minHeight: "200px", margin: "8px" }}
                  // editorState={editorState}
                  editorState={editorState}

                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={(editorState) => {
                    setEditorState(editorState)
                  }}
                  onChange={()=>onEditorChange(editorState)}
                />

            <br />
            <Stack direction="row" spacing={2} style={{ marginLeft: '8px', marginTop: '21px' }}>
              <Button
                onClick={() => {
                  submitForm(state_enum.saved)
                }}
                variant="contained" color="warning">
                Save
              </Button>
              <Button
                onClick={() => {
                  submitForm(state_enum.review)
                }}
                variant="contained" color="info">
                Ready for review
              </Button>
              <Button
                onClick={() => {
                  submitForm(state_enum.published)
                }}
                variant="contained" color="success">
                Publish
              </Button>
              <Button
                onClick={() => {
                  submitForm(state_enum.hidden)
                }}
                variant="contained" color="error">
                Hide
              </Button>
            </Stack>
            </ThemeProvider>
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
  )
};

export default NewSubCategory;