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

const initialFormValues = {
  name: '',
}

const NewCategory = (props) => {
  const { userId } = useParams();
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues);

  useEffect(() => {
    if (userId) {
      api.fetchUser(userId)
      .then(response => {
        setValues(response.data.user);
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      });
    }
  }, []);

  const submitForm = async function (state) {

    try {
      let body = {
        ...values,
        state: state
      }
      if(userId){
        const response = await api.updateUser(userId, body);
        console.log(response)
        if (response.status === 200) {
          let msg = "User is updated !" 
  
          window.location.href = '/users?msg=' + msg;
  
        } else {
          toast.error("Some error occurred")
        }
      } else {
        const response = await api.createCategory(body);
        console.log(response)
        if (response.status === 201) {
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

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="form-container">
          <h1>{props.title}</h1>
          <Form>
            <Controls.Input
              name='name'
              label="Name"
              value={values.name}
              onChange={handleInputChange}
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
          <br/>
          <br/>
          <br/>

        </div>
      </div>
    </div>
  )
};

export default NewCategory;