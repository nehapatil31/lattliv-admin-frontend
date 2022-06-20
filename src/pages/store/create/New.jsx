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

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues);

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
              <Grid container>
                <Grid item xs={6}>
                  <Controls.Input
                    name='name'
                    label="Name"
                    value={values.name}
                    onChange={handleInputChange}
                  />

                  <Controls.Input
                    name='place'
                    label="Location"
                    value={values.place}
                    onChange={handleInputChange}
                  />
                  <Controls.Input
                    name='address'
                    label="Address"
                    value={values.address}
                    onChange={handleInputChange}
                  />
                  <Controls.Input
                  name='map'
                  label="Map link"
                  value={values.map}
                  onChange={handleInputChange}
                />
                </Grid>
                <Grid item xs={6}>
                  <Controls.Input
                    name='email'
                    label="Email"
                    value={values.email}
                    onChange={handleInputChange}
                  />
                  <Controls.Input
                    name='manager'
                    label="Manager name"
                    value={values.manager}
                    onChange={handleInputChange}
                  />
                  <Controls.Input
                    name='number'
                    label="Number(s)"
                    value={values.number}
                    onChange={handleInputChange}
                  />
                  <Controls.Input
                    name='timings'
                    label="timings"
                    value={values.timings}
                    onChange={handleInputChange}
                  />
                </Grid>
                
              </Grid>

              <br />

              <input type="file" id="myFile" onChange={event => { }} style={{ marginLeft: "12px" }} />

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

            </Form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStore;
