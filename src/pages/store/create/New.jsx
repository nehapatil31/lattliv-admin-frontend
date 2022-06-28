import * as api from '../../../api'
import * as access from '../../../access'
import "./new.scss";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { Grid, Button } from "@mui/material";

import { useForm, Form } from "../../../components/form/useForm";
import Controls from '../../../components/form/Controls'
import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import { mandatoryTheam } from '../../../utils'


const initialFormValues = {
  name: '',
  place: '',
  address: '',
  email: '',
  number: [],
  manager: '',
  map: '',
  image: '',
  timings: ''
}

const NewStore = (props) => {

  const [file, setFile] = useState("");
  const { storeId } = useParams();
  const [images, setImages] = useState({imgName: '', alttag: '', url: ''});
  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
        temp.name = fieldValues.name ? "" : "This field is required."
    if ('place' in fieldValues)
        temp.place = fieldValues.place ? "" : "This field is required."
    if ('address' in fieldValues)
        temp.address = fieldValues.address ? "" : "This field is required."
    if ('email' in fieldValues){
      temp.email = fieldValues.email ? "" : "This field is required."
        if(fieldValues.email){
          temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        }
    }
    if ('number' in fieldValues)
      temp.number = fieldValues.number ? "" : "This field is required."
    if ('map' in fieldValues)
      temp.map = fieldValues.map ? "" : "This field is required."
    if ('timings' in fieldValues)
      temp.timings = fieldValues.timings ? "" : "This field is required."
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
  } = useForm(initialFormValues, true, validate);

  const handleImageAdd = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('myFile', event.target.files[0]);
    api.uploadFile(data)
      .then(response => {
        console.log(response.data)
        setImages({
          ...images,
          imgName: event.target.files[0].name,
          alttag: event.target.files[0].name,
          url: response.data.url
        })

      }).catch(error => {
        console.log(error)
      });
  }

  useEffect(() => {
    if (storeId) {
      //get store data
      api.fetchStore(storeId)
        .then(response => {
          let dataObj = { ...response.data }


          setValues(dataObj);
        }).catch(error => {
          console.log(error)
        });
    }
  }, [])
  const submitForm = async function (state) {

    try {
      if(validate()){
        let body = {
          ...values
        }
        if (storeId) {
          body.id = storeId;
          const response = await api.updateStore( body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Store is updated !"
  
            window.location.href = '/stores?msg=' + msg;
  
          } else {
            toast.error("Some error occurred")
          }
        } else {
          const response = await api.createStore(body);
          console.log(response)
          if (response.status === 200) {
            let msg = "Store is created !"
  
            window.location.href = '/stores?msg=' + msg;
  
          } else {
            toast.error("Some error occurred")
          }
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
        <div className="top">
          <h1>{props.title}</h1>
        </div>
        <ToastContainer icon={false} autoClose={3000} />
        <div className="bottom">
          <div className="right">


            <Form>
            <ThemeProvider theme={mandatoryTheam}>
              <Grid container>
                <Grid item xs={6}>
              
                  <Controls.Input
                    required
                    name='name'
                    label="Name"
                    value={values.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />

                  <Controls.Input
                    required
                    name='place'
                    label="Location"
                    value={values.place}
                    onChange={handleInputChange}
                    error={errors.place}
                  />
                  <Controls.Input
                    required
                    name='address'
                    label="Address"
                    value={values.address}
                    onChange={handleInputChange}
                    error={errors.address}
                  />
                  <Controls.Input
                  required
                  name='map'
                  label="Map link"
                  value={values.map}
                  onChange={handleInputChange}
                  error={errors.map}
                />
                </Grid>
                <Grid item xs={6}>
                  <Controls.Input
                    required
                    name='email'
                    label="Email"
                    value={values.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                  <Controls.Input
                    
                    name='manager'
                    label="Manager name"
                    value={values.manager}
                    onChange={handleInputChange}
                  />
                  <Controls.Input
                    required
                    name='number'
                    label="Number(s)"
                    value={values.number}
                    onChange={handleInputChange}
                    error={errors.number}
                  />
                  <Controls.Input
                    required
                    name='timings'
                    label="timings"
                    value={values.timings}
                    onChange={handleInputChange}
                    error={errors.timings}
                  />
                </Grid>
                
              </Grid>

              <br />
              <div className='image-container'>
                <input type="file" id="myFile" onChange={event => handleImageAdd(event)}   style={{display: 'none' }} />
                <label for="myFile"  className='upload-file'>Select File  <span style={{color: "red" }}>*</span></label>
                {images.imgName && <div className='image-label'> {images.imgName}</div>}
              </div>
              
              <br />
              <br />
              <Button
                onClick={() => {
                  submitForm()
                }}
                style={{ marginLeft: "12px" }}
                variant="contained" color="info">
                Submit
              </Button>
            </ThemeProvider>

            </Form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStore;
