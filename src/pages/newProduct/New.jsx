import "./new.scss";
import URL from '../../config'
import { useParams } from "react-router-dom";
import { nanoid,customAlphabet } from 'nanoid'
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Grid, Button, Stack } from "@mui/material";

import { useForm, Form } from "../../components/form/useForm";
import Controls from '../../components/form/Controls'

const state_enum = {
  saved: 1,
  published: 2,
  trashed: 3,
  hidden: 4,
  deleted: 5,
  review: 6
}
const availabilityItems = [
  {
    id:'in_stock',
    title: 'In stock'
  },
  {
    id:'out_of_stock',
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
  slug:'',
  createdBy: ''
}
const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [subcatergories, setSubcatergories] = useState([]);
  const [catergories, setcatergories] = useState([]);
  const {productId} = useParams();
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
} = useForm(initialFormValues);

  useEffect(()=>{
    if(productId){
      //get product data
      fetch(`${URL.base_url}/product/${productId}`)
      .then(results => results.json())
      .then(data => {
        setValues(data);
      });
    }else {
      const nanoid = customAlphabet('1234567890abcdef', 10)
      setValues({
        ...values,
        sku: nanoid(5),
      })
    }

    //get categories data
    fetch(`${URL.base_url}/categories`)
    .then(results => results.json())
    .then(data => {
      setcatergories(data);
    });
  },[])

  const submitForm = function(state){
    let body = {...values,
      state: state,
      createdBy: 1
    }
    let url = productId ? `${URL.base_url}/products/update/${productId}` :`${URL.base_url}/products/create`
    fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(body)
    }).then(()=>{
      console.log('done')
    })
  }


  
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
            <Form>
              <Grid container>
                <Grid item xs={6}>
                  <h2 style={{marginLeft : '8px'}}>SKU : {values.sku}</h2>
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
                  onChange={(e)=>{
                    let category = catergories.find(i=>i.id===e.target.value)

                    // reset subcategory value
                    setValues({
                      ...values,
                      subcategory: ''
                    })
                    
                    setSubcatergories(category.children)
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
                    onChange = {handleInputChange}       
                    items = {availabilityItems}
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
                <Controls.Input
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
                  />
              </Grid>
              <Stack direction="row" spacing={2} style={{marginLeft : '8px', marginTop: '21px'}}>
                <Button 
                 onClick={()=>{
                  submitForm(state_enum.saved)
                 }}
                variant="contained" color="warning">
                  Save
                </Button>
                <Button 
                 onClick={()=>{
                  submitForm(state_enum.review)
                 }}
                variant="contained" color="info">
                  Ready for review
                </Button>
                <Button
                 onClick={()=>{
                  submitForm(state_enum.published)
                 }}
                 variant="contained" color="success">
                  Publish
                </Button>
                <Button
                 onClick={()=>{
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

export default New;
