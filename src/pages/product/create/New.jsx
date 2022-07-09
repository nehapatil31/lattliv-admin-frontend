import * as api from '../../../api'
import * as access from '../../../access'
import "./new.scss";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
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
import { stateToHTML } from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import { mandatoryTheam, mandatoryLabel } from '../../../utils'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import slugify from 'react-slugify';
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
  specification: [],
  category: '',
  subcategory: '',
  state: '',
  slug: '',
  seo: {
    title: '',
    description: '',
    keywords: ''
  },
  images: []
}

const NewProduct = (props) => {
  const setEditorValues = function (dataObj) {
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
  const [editorState, setEditorState] = useState('')
  const [editorStateLong, setEditorStateLong] = useState('')

  const [file, setFile] = useState("");
  const [subcatergories, setSubcatergories] = useState([]);
  const [catergories, setcatergories] = useState([]);
  const { productId } = useParams();

  const validate = (fieldValues = values, state) => {

    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required."
    if ('price' in fieldValues)
      temp.price = fieldValues.price ? "" : "This field is required."
    if ('category' in fieldValues)
      temp.category = fieldValues.category ? "" : "This field is required."
    if ('subcategory' in fieldValues)
      temp.subcategory = fieldValues.subcategory ? "" : "This field is required."
    if ('slug' in fieldValues)
      temp.slug = fieldValues.slug && fieldValues.slug !=='/' ? "" : "This field is required."
    if(state === 2  || state === 6 || state === undefined){
      if (fieldValues?.seo?.title !== undefined && 'title' in fieldValues?.seo)
        temp.title = fieldValues.seo.title ? "" : "This field is required."
      if (fieldValues?.seo?.description !== undefined)
        temp.description = fieldValues.seo.description ? "" : "This field is required."
      if (fieldValues?.seo?.keywords !== undefined)
        temp.keywords = fieldValues.seo.keywords ? "" : "This field is required."
    }

    //check atleast one specification is added
    if (fieldValues?.specification?.length === 0)
      temp.specification = "This field is required."
    else {
      temp.specification = ""
      fieldValues?.specification?.forEach((item, index) => {
  
        if (item.specName === '')
          temp.specification = "One of the spec Name field is required."
        if (item.specValue === '')
          temp.specification = "One of the spec Value field is required."
      }
      )
    }

    //validate image field
    if (fieldValues?.images?.length === 0)
      temp.images = "This field is required."
    else {
      temp.images = ""
      let heroImage = fieldValues?.images?.find(item => item.isHeroImg === true)

      if (!heroImage)
        temp.images = "Main Image is required."
      else {
        temp.images=''
      }

      fieldValues?.images?.forEach((item, index) => {
        if (item.url === '')
          temp.images = "Please Upload the Image."
        if(item.alttag === '')
          temp.images = "Please Enter the Alt Tag."
      }
      )
    }

    // check if editor is empty or undefined
    if ('shortDesc' in fieldValues) {
      temp.shortDesc = (fieldValues.shortDesc === '<p><br></p>' || fieldValues.shortDesc ==='') ? "This field is required." : ""    
    }

    if ('longDesc' in fieldValues) {
      temp.longDesc = (fieldValues.longDesc === '<p><br></p>' || fieldValues.longDesc ==='') ? "This field is required." : ""   
    }

    setErrors({
      ...temp
    })

    if (fieldValues === values) {
      let validated = Object.values(temp).every(x => x === "")
      if (!validated) {
        toast.error('Validation errors',{
          autoClose: 9000,
          pauseOnHover: true,
        })
        return false
      } else {
        return true
      }
    }
  }
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues, true, validate);

  const [images, setImages] = useState([
    { id: uuidv4(), imgName: '', alttag: '', url: '', isHeroImg: false },
  ]);
  const handleImageData = (id, event) => {
    const newInputFields = images.map(i => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })

    setImages(newInputFields);
    setValues({ ...values, images: newInputFields })
    handleInputChange({
      target: {
        name:'images',
        value:newInputFields
      }
    })
    
  }
  const handleAddImages = () => {
    setImages([...images, { id: uuidv4(), imgName: '', alttag: '', url: '', isHeroImg: false }])
  }

  const handleRemoveImages = id => {
    const new_values = [...images];
    new_values.splice(new_values.findIndex(value => value.id === id), 1);

    setImages(new_values);
    setValues({ ...values, images: new_values })
    handleInputChange({
      target: {
        name:'images',
        value:new_values
      }
    })
    
  }
  const handleImageAdd = (id, event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('myFile', event.target.files[0]);
    api.uploadFile(data)
      .then(response => {
       
        const new_values = [...images];
        let img = new_values.find(value => value.id === id)

        img.url = response.data.url
        img.imgName = event.target.files[0].name
        setImages(new_values);
        setValues({ ...values, images: new_values })
        handleInputChange({
          target: {
            name:'images',
            value:new_values
          }
        })
      }).catch(error => {
        console.log(error)
      });
  }
 const handleCheckbox = (id, event) => {
    const new_values = [...images];
    let img = new_values.find(value => value.id === id)
    img.isHeroImg = event.target.checked
    if(img.isHeroImg){
      new_values.map(i => {
        if(i.id !== id){
          i.isHeroImg = false
        }
        return i
      }
      )
    }
    setImages(new_values);
    setValues({ ...values, images: new_values })
    handleInputChange({
      target: {
        name:'images',
        value:new_values
      }
    })
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

    handleInputChange({
      target: {
        name: 'specification',
        value: newInputFields
      }
    })
    setSpecFields(newInputFields);
    setValues({ ...values, specification: newInputFields })
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
    api.fetchCategories()
      .then(response => {
        // let subcategories = response.data.filter((item) => item.parent)
        let categories = response.data.filter((item) => !item.parent)
        setcatergories(categories);

        if (productId) {
          //get product data
          api.fetchProduct(productId)
            .then(response => {
              let data = response.data;
              let dataObj = { ...response.data }

              dataObj.category = data.category.parent.id
              dataObj.subcategory = data.category.id
              dataObj.availability = data.inStock ? 'in_stock' : 'out_of_stock'
              dataObj.specification = data.specification?.specFields

              let category = categories.find(i => i.id === dataObj.category)
              category.children && setSubcatergories(category.children)

              if (data.specification?.specFields) {
                setSpecFields(data.specification?.specFields)
              }
              if (data.images?.images) {
                dataObj.images = data.images?.images;
                setImages(data.images?.images)
              }

              setValues(dataObj);
              setEditorValues(dataObj);
            }).catch(error => {
              console.log(error)
            });

        } else {
          const nanoid = customAlphabet('1234567890abcdef', 10)
          setValues({
            ...values,
            sku: nanoid(5),
          })
        }
      }).catch(error => {
        console.log(error)
      });

  }, [])

  const submitForm = async function (state) {

    if (validate(values, state)) {
      let data = { ...values }
      data.slug = `https://lalltiv.in/product/${data.slug}`
      delete data.createdBy

      let body = {
        ...data,
        state: state,
        specification: {
          specFields: specFields
        },
        images: {
          images: images
        },
        shortDesc: stateToHTML(editorState.getCurrentContent()),
        longDesc: stateToHTML(editorStateLong.getCurrentContent())
      }

      body.inStock = body.availability === "in_stock"
      body.category = body.subcategory

      let msg = productId ? "Product is updated !" : "Product is created !"
      try {
        if (productId) {
          const response = await api.updateProduct(productId, body);
          if(response.status === 401){
            toast.error('You are not authorized to update this product',{
              autoClose: 9000,
              pauseOnHover: true,
            })
            window.location.href = "/login" 
          }
  
          if (response.status === 200) {
            let url = new URL(window.location.href)
            let page = url.searchParams.get("page")
            if(page){
              window.location.href = `/seo?msg=${msg}`
            }
            else{
              window.location.href = '/products?msg=' + msg
            }

          } else {
            toast.error("Some error occurred",{
              autoClose: 9000,
              pauseOnHover: true,
            })
          }
        } else {
          const response = await api.createProduct(body);

          if(response.status === 401){
            toast.error('You are not authorized to update this product',{
              autoClose: 9000,
              pauseOnHover: true,
            })
            window.location.href = "/login" 
          }

          if (response.status === 200) {
            window.location.href = '/products?msg=' + msg;
  
          } else {
            toast.error("Some error occurred",{
              autoClose: 9000,
              pauseOnHover: true,
            })
          }
        } 
      } catch (error) {
        toast.error(error.response.data.message,{
          autoClose: 9000,
          pauseOnHover: true,
        })
      }
    }


  }

  const handleInputChangeSlug = (e) => {
    let slug = e.target.value
    slug = slug.replace(/\s+/g, '-').toLowerCase()
    slug = slug.replace(/[^a-zA-Z0-9-]/g, '')
    setValues({ ...values, slug: slug })
    handleInputChange({
      target: {
        name: 'slug',
        value: slug
      }
    })
  }
  const isReadyForPublishOrHide = values.state.id ?? 0;

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{props.title}</h1>
        </div>
        {/* <ToastContainer icon={false} autoClose={3000} /> */}
        <div className="bottom">
          <div className="right">


            <Form>
            <ThemeProvider theme={mandatoryTheam}>
              <Grid container>
                <Grid item xs={6}>
                  <h2 style={{ marginLeft: '8px' }}>SKU : {values.sku}</h2>
                  <Controls.Input
                    required
                    name='name'
                    label="Name"
                    value={values.name}
                    error={errors.name}
                    onChange={handleInputChange}
                  />
                  <Controls.Select
                    required
                    name='category'
                    label="Category"
                    error={errors.category}
                    value={values.category}
                    onChange={(e) => {
                      let category = catergories.find(i => i.id === e.target.value)

                      category.children && setSubcatergories(category.children)
                      handleInputChange(e)
                    }}
                    options={catergories}
                  />
                  <Controls.Input
                    required
                    name='slug'
                    label="URLs"
                    value={values.slug}
                    tabIndex="0" 
                    onChange={handleInputChangeSlug}
                    error={errors.slug}
                    helperText={`https://lalltiv.in/product/${values.slug}`}
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
                    required
                    name='price'
                    label="Price"
                    value={values.price}
                    error={errors.price}
                    onChange={handleInputChange}
                  />
                  <Controls.Select
                    name='subcategory'
                    label="Sub-Category"
                    error={errors.subcategory}
                    value={values.subcategory}
                    onChange={handleInputChange}
                    options={subcatergories}
                    required
                  />
                </Grid>
                <h3 style={{ marginLeft: '8px' }}>Primary Content </h3><p style={{ color: 'red' }}>*</p>
                {errors.shortDesc && <p style={{ color: 'red', margin: '20px 20px' }}>{errors.shortDesc}</p>}
              
                <Editor
                  wrapperStyle={{ border: "1px solid #ddd", height: "100%", margin: "8px", }}
                  editorStyle={{ padding: "10px" , minHeight: "150px" }}
                  // editorState={editorState}
                  editorState={editorState}

                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={(editorState) => {
                    setEditorState(editorState)
                    handleInputChange({ target: { name: 'shortDesc', value: editorState } });
                  }}
                />

                <h3 style={{ marginLeft: '8px' }}>Secondary Content </h3><p style={{ color: 'red' }}>*</p>
                {errors.longDesc && <p style={{ color: 'red', margin: '20px 20px' }}>{errors.longDesc}</p>}
                <Editor 
                  wrapperStyle={{ border: "1px solid #ddd", height: "100%", margin: "8px", }}
                  editorStyle={{ padding: "10px" , minHeight: "150px" }}
                  // editorState={editorState}
                  editorState={editorStateLong}

                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={(editorState) => {
                    setEditorStateLong(editorState)
                    handleInputChange({ target: { name: 'longDesc', value: editorState } });
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
              <h3 style={{ marginLeft: '8px' }}>Specifications  {errors.specification && <span className="error">{errors.specification}</span>}</h3>
            
              {specFields.map(inputField => (
                <div key={inputField.id}>
                  <TextField
                    required
                    name="specName"
                    label="Specification Name"
                    variant="outlined"
                    value={inputField.specName}
                    onChange={event => handleChangeInput(inputField.id, event)}
                  />
                  <TextField
                    required
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
              <h3>Images {errors.images && <span className="error">{errors.images}</span>}</h3>
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
                        <label htmlFor="myFile"  className='upload-file'>Select File  <span style={{color: "red" }}>*</span></label>
                        <br />
                        <br />
                      </>
                    )
                  }
                  {/* isHeroImg */}
                  <FormGroup>
                    <FormControlLabel label="Main Image" control={<Checkbox 
                    checked={inputField.isHeroImg}
                      onChange={event => handleCheckbox(inputField.id, event)}
                    />}  />
                  </FormGroup>

                  {/* <input type="file" name="myFile" onChange={event=>handleImageAdd(inputField.id, event)} /> */}
                  <TextField
                    required
                    name="alttag"
                    label="Alt Tag"
                    variant="standard"
                    value={inputField.alttag}
                    style={{ marginRight: "12px" }}
                    onChange={event => handleImageData(inputField.id, event)}
                  />

                  {inputField.url && (
                    <a href={inputField.url} rel='noreferrer' target="_blank">
                      <img src={inputField.url} alt='product img'  style={{ height: '100px', width: '100px', border: '1px solid #B1B1B1',padding: '3px' }} />
                    </a>
                  )}
                  <IconButton disabled={images.length === 1} onClick={() => handleRemoveImages(inputField.id)}>
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
              <h3>SEO Metatags</h3>
              <Controls.Input
                name='title'
                label={mandatoryLabel('Title')}
                value={values.seo.title}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{color: values.seo.title.length > 56 ? 'red' :'black'}}>
                    {values.seo.title.length}
                    </InputAdornment>
                  ),
                }}
                
              />
              <Controls.Input
                name='description'
                label={mandatoryLabel('Description')}
                error={errors.description}
                value={values.seo.description}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{color: values.seo.description.length > 156 ? 'red' :'black'}}>
                    {values.seo.description.length}
                    </InputAdornment>
                  ),
                }}
              />
              <Controls.Input
                name='keywords'
                label={mandatoryLabel('Keywords')}
                error={errors.keywords}
                value={values.seo.keywords}
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
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="info">
                  <AlertTitle>Info</AlertTitle>
                  On Ready For Review and Publish <strong>Double ** </strong> are mandatory field
                </Alert>
              </Stack>
              <Stack direction="row" spacing={2} style={{ marginLeft: '8px', marginTop: '21px' }}>
                <Button
                  disabled={access.product_create ? false : true}
                  onClick={() => {
                    submitForm(state_enum.saved)
                  }}
                  variant="contained" color="warning">
                  Save
                </Button>
                <Button
                  disabled={access.product_create ? false : true}
                  onClick={() => {
                    submitForm(state_enum.review)
                  }}
                  variant="contained" color="info">
                  Ready for review
                </Button>
                <Button
                  disabled={access.product_publish ?  (isReadyForPublishOrHide === 2 ? true: false) :true}
                  onClick={() => {
                    submitForm(state_enum.published)
                  }}
                  variant="contained" color="success">
                  Publish
                </Button>
                <Button
                  disabled={access.product_hide ? (isReadyForPublishOrHide === 6 ? true: false) : true}
                  onClick={() => {
                    submitForm(state_enum.hidden)
                  }}
                  variant="contained" color="error">
                  Hide
                </Button>
              </Stack>
              </ThemeProvider>
            </Form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
