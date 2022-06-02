import * as access from '../../../access'
import "./new.scss";
import { url, state_enum } from '../../../config'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { nanoid, customAlphabet } from 'nanoid'
import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { Grid, Button, Stack, TextField, IconButton, Typography } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Form } from "../../../components/form/useForm";
import Controls from '../../../components/form/Controls'
import { v4 as uuidv4 } from 'uuid';
import { Editor } from "react-draft-wysiwyg";
import {stateToHTML} from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React from "react";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML
} from "draft-js"

const availabilityItems = [
  {
    id: 'in_stock',
    title: 'In stock'
  },
  {
    id: 'out_of_stock',
    title: 'Out of stock'
  }
]

const initialFormValues = {
  availability: 'in_stock',
  sku: '',
  name: '',
  shortDesc: '',
  longDesc: '',
  price: '',
  specification: {},
  category: '',
  subcategory: '',
  state: '',
  slug: '',
  createdBy: ''
}

const NewProduct = (props) => {
  const setEditorValues = function(dataObj){
    let content1 = dataObj?.shortDesc ? dataObj?.shortDesc : ''
    let content2 = dataObj?.longDesc ? dataObj?.longDesc : ''
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
    setEditorStateLong(() => {
      const blocksFromHTML = convertFromHTML(content2)
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      )
  
      return EditorState.createWithContent(contentState)
    })
  }
  const [editorState, setEditorState] = useState()
  const [editorStateLong, setEditorStateLong] = useState()

  const [file, setFile] = useState("");
  const [subcatergories, setSubcatergories] = useState([]);
  const [catergories, setcatergories] = useState([]);
  const { productId } = useParams();

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues);

  const [images, setImages] = useState([
    { id: uuidv4(), imgName: '', alttag: '', url: '' },
  ]);
  const handleImageData = (id, event) => {
    const newInputFields = images.map(i => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })

    setImages(newInputFields);
  }
  const handleAddImages = () => {
    setImages([...images, { id: uuidv4(), imgName: '', alttag: '', ur: '' }])
  }

  const handleRemoveImages = id => {
    const values = [...images];
    values.splice(values.findIndex(value => value.id === id), 1);
    setImages(values);
  }
  const handleImageAdd = (id, event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('myFile', event.target.files[0]);
    console.log(data)
    fetch("http://localhost:1337/upload", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: data
    }).then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          const values = [...images];
          let img = values.find(value => value.id === id)
          img.url = result.url
          img.imgName = event.target.files[0].name
          setImages(values);
        },
        (error) => {
          console.log(error)
        }
      )
  }

  const [specFields, setSpecFields] = useState([
    { id: uuidv4(), specName: '', specValue: '' },
  ]);

  const handleChangeInput = (id, event) => {
    const newInputFields = specFields.map(i => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })

    setSpecFields(newInputFields);
  }

  const handleAddFields = () => {
    setSpecFields([...specFields, { id: uuidv4(), specName: '', specValue: '' }])
  }

  const handleRemoveFields = id => {
    const values = [...specFields];
    values.splice(values.findIndex(value => value.id === id), 1);
    setSpecFields(values);
  }

  useEffect(() => {
    //get categories data
    fetch(`${url.base_url}/categories/parents`)
      .then(results => results.json())
      .then(categoryData => {
        setcatergories(categoryData);

        if (productId) {
          //get product data
          fetch(`${url.base_url}/products/${productId}`)
            .then(results => results.json())
            .then(data => {
              let dataObj = { ...data }
              dataObj.category = data.category.parent.id
              dataObj.subcategory = data.category.id
              dataObj.availability = data.inStock ? 'in_stock' : 'out_of_stock'

              let category = categoryData.find(i => i.id === dataObj.category)
              category.children && setSubcatergories(category.children)

              if (data.specification?.specFields) {
                setSpecFields(data.specification?.specFields)
              }
              if (data.images?.images) {
                setImages(data.images?.images)
              }

              setValues(dataObj);
              setEditorValues(dataObj);
            });
        } else {
          const nanoid = customAlphabet('1234567890abcdef', 10)
          setValues({
            ...values,
            sku: nanoid(5),
          })
        }
      });




  }, [])

  const submitForm = function (state) {
    let body = {
      ...values,
      state: state,
      createdBy: 1,
      specification: {
        specFields: specFields
      },
      images: {
        images: images
      },
      shortDesc: stateToHTML(editorState.getCurrentContent()),
      longDesc: stateToHTML(editorStateLong.getCurrentContent())
    }
    let apiUrl = productId ? `${url.base_url}/products/update/${productId}` : `${url.base_url}/products/create`
    body.inStock = body.availability === "in_stock"
    body.category = body.subcategory

    fetch(apiUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then((res) => {
      if (res.status === 200) {
        let msg = productId ? "Product is updated !" : "Product is created !"

        window.location.href = '/products?msg=' + msg;
      } else {
        toast.error("Some error occurred")
      }

    })
  }



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
            <h3>Images</h3>
            {images.map(inputField => (
              <div key={inputField.id}>
                {
                  inputField.imgName && (
                    <div>Image name: {inputField.imgName}</div>

                  )
                }
                {
                  !inputField.imgName && (
                    <>
                      <input type="file" id="myFile" onChange={event => handleImageAdd(inputField.id, event)} style={{ display: 'none' }} />
                      <label for="myFile" style={{
                        cursor: 'pointer',
                        color: '#0288d1',
                        marginRight: '12px'
                      }}>Select File</label>
                      <br />
                      <br />
                    </>
                  )
                }

                {/* <input type="file" name="myFile" onChange={event=>handleImageAdd(inputField.id, event)} /> */}
                <TextField
                  name="alttag"
                  label="Alt Tag"
                  variant="standard"
                  value={inputField.alttag}
                  style={{ marginRight: "12px" }}
                  onChange={event => handleImageData(inputField.id, event)}
                />

                {inputField.url && (
                  <>
                    <img src={inputField.url} style={{ height: '100px', width: '100px' }} />
                    {/* <a href={inputField.url} target="_blank">Check image</a> */}
                  </>
                )}
                <IconButton disabled={specFields.length === 1} onClick={() => handleRemoveImages(inputField.id)}>
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  onClick={handleAddImages}
                >
                  <AddIcon />
                </IconButton>
                {/* {inputField.url && <a href={inputField.url} target="_blank">Check image</a>} */}
                <br />
                <br />
                <br />
              </div>
            ))}
            <Form>
              <Grid container>
                <Grid item xs={6}>
                  <h2 style={{ marginLeft: '8px' }}>SKU : {values.sku}</h2>
                  <Controls.Input
                    name='name'
                    label="Name"
                    value={values.name}
                    onChange={handleInputChange}
                  />
                  <Controls.Select
                    name='category'
                    label="Category"
                    value={values.category}
                    onChange={(e) => {
                      let category = catergories.find(i => i.id === e.target.value)

                      // reset subcategory value
                      // setValues({
                      //   ...values,
                      //   subcategory: ''
                      // })

                      category.children && setSubcatergories(category.children)
                      handleInputChange(e)
                    }}
                    options={catergories}
                  />
                  <Controls.Input
                    name='slug'
                    label="URL"
                    value={values.slug}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controls.RadioGroup
                    name="availability"
                    value={values.availability}
                    onChange={handleInputChange}
                    items={availabilityItems}
                  />
                  <Controls.Input
                    name='price'
                    label="Price"
                    value={values.price}
                    onChange={handleInputChange}
                  />
                  <Controls.Select
                    name='subcategory'
                    label="Sub-Category"
                    value={values.subcategory}
                    onChange={handleInputChange}
                    options={subcatergories}
                  />
                </Grid>
                <p>Primary Content</p>
                <Editor
                  wrapperStyle={{border: "1px solid #ddd", minHeight: "200px", margin:"8px"}}
                  // editorState={editorState}
                  editorState={editorState}
                  
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={(editorState)=>{
                  setEditorState(editorState)
                  }}
                />
                <p>Secondary Content</p>
                <Editor
                  wrapperStyle={{border: "1px solid #ddd", minHeight: "200px", margin:"8px"}}
                  // editorState={editorState}
                  editorState={editorStateLong}
                  
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={(editorState)=>{
                  setEditorStateLong(editorState)
                  }}
                />
                {/* <Controls.Input
                  name='shortDesc'
                  label="Primary Content"
                  value={values.shortDesc}
                  onChange={handleInputChange}
                />
                <Controls.Input
                  name='longDesc'
                  label="Secondary Content"
                  value={values.longDesc}
                  onChange={handleInputChange}
                /> */}
              </Grid>
              <h3>Specifications</h3>
              {specFields.map(inputField => (
                <div key={inputField.id}>
                  <TextField
                    name="specName"
                    label="Specification Name"
                    variant="outlined"
                    value={inputField.specName}
                    onChange={event => handleChangeInput(inputField.id, event)}
                  />
                  <TextField
                    name="specValue"
                    label="Value"
                    variant="outlined"
                    value={inputField.specValue}
                    onChange={event => handleChangeInput(inputField.id, event)}
                  />
                  <IconButton disabled={specFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleAddFields}
                  >
                    <AddIcon />
                  </IconButton>
                  <br />
                  <br />
                  <br />
                </div>
              ))}

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
                disabled={access.product_hide}
                  onClick={() => {
                    submitForm(state_enum.hidden)
                  }}
                  variant="contained" color="error">
                  Hide
                </Button>
              </Stack>

            </Form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
