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

const initialFormValues = {
  name: '',
}

const NewSubCategory = (props) => {
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
        state: 2
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
        const response = await api.createUser(body);
        console.log(response)
        if (response.status === 201) {
          let msg = "User is created !" 
  
          window.location.href = '/users?msg=' + msg;
  
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
            
          </Form>
          <Button
            onClick={() => {
              submitForm()
            }}
            variant="contained" color="info">
            Submit
          </Button>
          <br/>
          <br/>
          <br/>

        </div>
      </div>
    </div>
  )
};

export default NewSubCategory;