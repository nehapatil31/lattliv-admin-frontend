import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useForm, Form } from "../../../components/form/useForm";
import { url } from '../../../config'
import Controls from '../../../components/form/Controls'
import { toast, ToastContainer } from 'react-toastify';
import { Grid, Button, Stack, TextField, IconButton, Typography } from "@mui/material";

const initialFormValues = {
  name: '',
  email: '',
  phone: ''
}

const NewUser = (props) => {
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFormValues);

  const submitForm = function (state) {
    let body = {
      ...values,
    }
    let apiUrl =  `${url.base_url}/users/create` //productId ? `${url.base_url}/products/update/${productId}` :
    
    fetch(apiUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then((res) => {
      if (res.status === 200) {
        let msg = "User is created !" //productId ? "Product is updated !" : 

        window.location.href = '/users?msg=' + msg;
      } else {
        toast.error("Some error occurred")
      }

    })
  }

  return(
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
      <Controls.Input
        name='email'
        label="Email"
        value={values.email}
        onChange={handleInputChange}
      />
      <Controls.Input
        name='phone'
        label="Phone"
        value={values.phone}
        onChange={handleInputChange}
      />
      </Form>
      <Button
        onClick={() => {
          submitForm()
        }}
        variant="contained" color="info">
        Submit
      </Button>
      </div>
    </div>
  </div>
  )
};
  
  export default NewUser;