import "./new.scss";
import { url, state_enum } from '../../config'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { nanoid, customAlphabet } from 'nanoid'
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Grid, Button, Stack, TextField, IconButton } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Form } from "../../components/form/useForm";
import Controls from '../../components/form/Controls'
import { v4 as uuidv4 } from 'uuid';


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

const New = (props) => {
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

  const [specFields, setSpecFields] = useState([
    { id: uuidv4(), specName: '', specValue: '' },
  ]);
  const handleChangeInput = (id, event) => {
    const newInputFields = specFields.map(i => {
      if(id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    
    setSpecFields(newInputFields);
  }

  const handleAddFields = () => {
    setSpecFields([...specFields, { id: uuidv4(),  specName: '', specValue: '' }])
  }

  const handleRemoveFields = id => {
    const values  = [...specFields];
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

              if(data.specification?.specFields){
                setSpecFields(data.specification?.specFields)
              }

              setValues(dataObj);
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
      specification:{
        specFields: specFields
      }
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
            <form action="http://localhost:1337/upload" enctype="multipart/form-data" method="post">
              <input type="text" name="title" /><br />
              <input type="file" name="myFile" /><br />
              <input type="file" name="myFile2" /><br />
              <input type="file" name="myFile3" /><br />
              <input type="file" name="myFile4" /><br />
              <input type="file" name="myFile5" /><br />
              <input type="submit" value="Upload" />
            </form>
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

export default New;
