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
  email: '',
  phone: '',
  password: '',
  access: {
    "products": {
      "create": false,
      "edit": false,
      "delete": false,
      "publish": false,
      "view": false,
      "hide": false
    },
    "categories": {
      "create": false,
      "edit": false,
      "delete": false,
      "view": false,
      "publish": false,
    },
    "subcategories": {
      "create": false,
      "edit": false,
      "delete": false,
      "view": false,
      "publish": false,
    },
    "users": {
      "create": false,
      "edit": false,
      "delete": false,
      "view": false
    },
    "stores": {
      "create": false,
      "edit": false,
      "delete": false,
      "view": false
    }
  }
}

const NewUser = (props) => {
  const { userId } = useParams();

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required."
    if ('password' in fieldValues)
      temp.password = fieldValues.password ? "" : "This field is required."
    if ('email' in fieldValues)
      temp.email = fieldValues.email ? "" : "This field is required."
    if (fieldValues.email) {
      temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
    }
    if ('phone' in fieldValues)
      temp.phone = fieldValues.phone.length > 9 ? "" : "Minimum 10 numbers required."
    setErrors({
      ...temp
    })

    let isAccessSelected = function () {
      let access = values.access
      let validated = false;
      Object.keys(access).map(key => {
        Object.keys(access[key]).map(item => {
          if (access[key][item]) {
            validated = true;
          }
        })
      })
      return validated;
    }

    if (!isAccessSelected()) {
      toast.error('Please select at least one access checkbox.')
      return false
    }

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
    if (userId) {
      api.fetchUser(userId)
        .then(response => {
          setValues(response.data);
          console.log(response.data)
        }).catch(error => {
          console.log(error)
        });
    }
  }, []);

  const submitForm = async function (state) {

    try {
      if (validate()) {
        let body = {
          ...values,
          state: 2
        }
        if (userId) {
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
      }
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred")
    }
  }


  let accessHtml;
  if (initialFormValues.access) {
    let access = initialFormValues.access
    accessHtml = Object.keys(access).map(key =>
      <div key={key}>
        <br />
        <Typography variant="h6" gutterBottom component="div">
          {key}
        </Typography>
        <Box >
          {Object.keys(access[key]).map(item => {
            return (<FormControlLabel
              key={item}
              label={item}
              control={<Checkbox
                checked={values.access[key][item]}
                name={`${key}-${item}`}
                onChange={function (e) {
                  let { name, checked } = e.target
                  let [key, item] = name.split('-')
                  let new_access = JSON.parse(JSON.stringify(values.access));;
                  new_access[key][item] = checked
                  setValues({
                    ...values,
                    access: new_access
                  })

                }}
              />}
            />)
          }
          )}
        </Box>
      </div>
    )

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
              error={errors.name}
            />
            <Controls.Input
              name='email'
              label="Email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <Controls.Input
              name='phone'
              label="Phone"
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <Controls.Input
              name='password'
              label="password"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <br />
            <br />
            <h3>Permissions</h3>
            {accessHtml}
          </Form>
          <Button
            onClick={() => {
              submitForm()
            }}
            variant="contained" color="info">
            Submit
          </Button>
          <br />
          <br />
          <br />

        </div>
      </div>
    </div>
  )
};

export default NewUser;