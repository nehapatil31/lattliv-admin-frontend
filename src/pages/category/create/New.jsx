import * as access from '../../../access'
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
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { state_enum } from '../../../config'
import { ThemeProvider } from '@mui/material/styles';
import { mandatoryTheam } from '../../../utils'

const initialFormValues = {
  name: '',
  seo:{
    title:'',
    description: '',
    keywords: ''
  }
}

const NewCategory = (props) => {
  const { categoryId } = useParams();
  const validate = (fieldValues = values, state) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required."
    
    if(state === 2  || state === 6){
      if ('title' in fieldValues.seo)
        temp.title = fieldValues.seo.title ? "" : "This field is required."
      if ('description' in fieldValues.seo)
        temp.description = fieldValues.seo.description ? "" : "This field is required."
      if ('keywords' in fieldValues.seo)
        temp.keywords = fieldValues.seo.keywords ? "" : "This field is required."
    }else{
      temp.title = ''
      temp.description = ''
      temp.keywords = ''
    }
    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues, true, validate);

  useEffect(() => {
    if (categoryId) {
      api.fetchCategory(categoryId)
      .then(response => {
        setValues(response.data);
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      });
    }
  }, []);

  const submitForm = async function (state) {

    if (validate(values, state)) {
      try {
        let body = {
          ...values,
          state: state
        }
        if(categoryId){
          delete body?.parent;
          const response = await api.updateCategory(categoryId, body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Category is updated !" 
    
            window.location.href = '/categories?msg=' + msg;
    
          } else {
            toast.error("Some error occurred")
          }
        } else {
          body.createdBy = access.user_id
          const response = await api.createCategory(body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Category is created !" 
    
            window.location.href = '/categories?msg=' + msg;
    
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
            <ThemeProvider theme={mandatoryTheam}>
              <Controls.Input
                required
                name='name'
                label="Name"
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}
              />
              
              <br />
              <h3>SEO Metatags</h3>
                <Controls.Input
                  name='title'
                  error={errors.title}
                  label="Title"
                  value={values.seo.title}
                  onChange={(e) => {
                    let { name, value } = e.target
                    let new_values = JSON.parse(JSON.stringify(values));;
                    new_values.seo[name] = value
                    setValues({
                      ...new_values
                    })
                    validate();
                 
                  }}
                />
                <Controls.Input
                  name='description'
                  label="Description"
                  value={values.seo.description}
                  error={errors.description}
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
                  error={errors.keywords}
                  label="Keywords"
                  value={values.seo.keywords}
                  onChange={(e) => {
                    let { name, value } = e.target
                    let new_values = JSON.parse(JSON.stringify(values));;
                    new_values.seo[name] = value
                    setValues({
                      ...new_values
                    })
                  }}
                />
            </ThemeProvider>
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
          <br/>
          <br/>
          <br/>

        </div>
      </div>
    </div>
  )
};

export default NewCategory;