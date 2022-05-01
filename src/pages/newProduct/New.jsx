import "./new.scss";
import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Grid } from "@mui/material";

import { useForm, Form } from "../../components/form/useForm";
import Controls from '../../components/form/Controls'


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
const catergories = [
  { id: '1', title: 'Development',
  children:[
    {
      id:'1.1',
      title: 'test1'
    },
    {
      id:'1.2',
      title: 'test2'
    }
  ]
 },
    { id: '2', title: 'Marketing' ,
    children:[
      {
        id:'2.1',
        title: 'test21'
      },
      {
        id:'2.2',
        title: 'test22'
      }
    ]},
    { id: '3', title: 'Accounting',
    children:[
      {
        id:'3.1',
        title: 'test31'
      },
      {
        id:'3.2',
        title: 'test32'
      }
    ] },
    { id: '4', title: 'HR' ,
    children:[
      {
        id:'4.1',
        title: 'test41'
      },
      {
        id:'4.2',
        title: 'test42'
      }
    ]},
]
const initialFormValues = {
  id: 0,
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


  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
} = useForm(initialFormValues);
  
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
                  <h2 style={{marginLeft : '8px'}}>SKU : 123</h2>
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
                    console.log(e.target.value)
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
            </Form>
              
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
