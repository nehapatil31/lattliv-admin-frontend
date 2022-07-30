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
import { ThemeProvider } from '@mui/material/styles';
import { mandatoryTheam } from '../../../utils'
import Unauthorized from "../../../utils/unauthorized";
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
    },
    "homepage": {
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


    let isAccessSelected = function () {
      let access = fieldValues.access ??values.access;
     
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

    if (!isAccessSelected() && 'access' in fieldValues) {
      temp.access = "Please select at least one access."
    }else{
      temp.access  = ""
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
  } = useForm(initialFormValues, true, validate);

  useEffect(() => {
    if (userId) {
      api.fetchUser(userId)
        .then(response => {
          let access  ={...values.access,...response.data.access};
          setValues({...response.data,access});
         
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
          await api.updateUser(userId, body)
          .then((res) => {
            let msg = "User is updated !"
            window.location.href = '/users?msg=' + msg;
          })
          .catch((err) => {
            Unauthorized(err);
            toast.error(err.response.data.message, {
              autoClose: 9000,
              pauseOnHover: true,
            });
          });
        } else {
        await api.createUser(body)
          .then((res) => {
            let msg = "User is created !"
            window.location.href = '/users?msg=' + msg;
          })
          .catch((err) => {
            Unauthorized(err);
            toast.error(err.response.data.message, {
              autoClose: 9000,
              pauseOnHover: true,
            });
          });
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Some error occurred",{
        autoClose: 9000,
        pauseOnHover: true,
      })
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
            console.log("v",values.access)
            return (<FormControlLabel
              key={item}
              label={item}
              control={<Checkbox
                checked={values.access[key][item]}
                name={`${key}-${item}`}
                onChange={function (e) {
                  let { name, checked } = e.target
                  let [key, item] = name.split('-')
                  let new_access = JSON.parse(JSON.stringify(values.access));
                  if (item !== 'view') {
                    if (checked) {
                      new_access[key]['view'] = true;
                    }
                  }
                  new_access[key][item] = checked
                  setValues({
                    ...values,
                    access: new_access
                  })
                  handleInputChange({ target: { name: 'access', value: new_access } });
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

         
          <Form >
            <ThemeProvider theme={mandatoryTheam}>
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
                name='email'
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              <Controls.Input
                required
                name='phone'
                label="Phone"
                value={values.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
              <Controls.Input
                required
                name='password'
                label="Password"
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
              />
              <br />
              <br />
              <h3>Permissions<span style={{color: "red" }}>*</span></h3>
              {errors.access && <span style={{color: "red" }}>{errors.access}</span>}
              {accessHtml}
            </ThemeProvider>
          </Form>
       
          <Button
            onClick={() => {
              submitForm()
            }}
            variant="contained" color="info">
            {userId ? "Update User" : "Add New User"}
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