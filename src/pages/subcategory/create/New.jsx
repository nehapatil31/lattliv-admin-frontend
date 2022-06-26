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

const initialFormValues = {
  name: '',
  parent: '',
  seo: {
    title: '',
    description: '',
    keywords: ''
  }
}

const NewSubCategory = (props) => {
  const { subcategoryId } = useParams();
  const [categories, setCategories] = useState();

  const validate = (fieldValues = values, state) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required."
    if ('parent' in fieldValues)
      temp.parent = fieldValues.parent ? "" : "This field is required."

    if (state == 2) {
      if ('title' in fieldValues.seo)
        temp.title = fieldValues.seo.title ? "" : "This field is required."
      if ('description' in fieldValues.seo)
        temp.description = fieldValues.seo.description ? "" : "This field is required."
      if ('keywords' in fieldValues.seo)
        temp.keywords = fieldValues.seo.keywords ? "" : "This field is required."
    } else {
      temp.title = ''
      temp.description = ''
      temp.keywords = ''
    }
    setErrors({
      ...temp
    })

    if (fieldValues == values)
      return Object.values(temp).every(x => x == "")
  }
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues, false, validate);

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
          createdBy: access.user_id
        }
        if (subcategoryId) {
          const response = await api.updateCategory(subcategoryId, body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Sub category is updated !"
  
            window.location.href = '/categories?subcategory=true&&msg=' + msg;
  
          } else {
            toast.error("Some error occurred")
          }
        } else {
          const response = await api.createSubcategory(body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Subcategory is created !"
  
            window.location.href = '/categories?subcategory=true&&msg=' + msg;
  
          } else {
            toast.error("Some error occurred")
          }
        }
      } catch (error) {
        console.log(error)
        toast.error("Some error occurred")
      }
    }
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="form-container">
          <h1>{props.title}</h1>
          <Form>

            {categories && (
              <Controls.Select
                name='parent'
                error={errors.parent}
                label="Category"
                value={values.parent}
                onChange={(e) => {
                  // let category = catergories.find(i => i.id === e.target.value)

                  // reset subcategory value
                  // setValues({
                  //   ...values,
                  //   subcategory: ''
                  // })

                  // category.children && setSubcatergories(category.children)
                  handleInputChange(e)
                }}
                options={categories}
              />
            )}

            <Controls.Input
              name='name'
              error={errors.name}
              label="Name"
              value={values.name}
              onChange={handleInputChange}
            />

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
                setValues({
                  ...new_values
                })
              }}
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