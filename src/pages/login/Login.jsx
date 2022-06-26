import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';
import { useSearchParams } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as api from '../../api';
import { useEffect } from 'react';


const theme = createTheme();

export default function SignIn() {
  let isToastcalled = false
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!isToastcalled && searchParams.get("msg")) {
      isToastcalled = true
      toast.error(searchParams.get("msg"))
    }
  }, [])

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      let body = {
        email: formData.get('email'),
        password: formData.get('password'),
      }
      const { data } = await api.signin(body);
      localStorage.setItem('profile', JSON.stringify({ ...data }));
      window.location.href = '/'
    } catch (error) {
      window.location.href = '/login?msg=Not correct email id or password';
      console.log(error)
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
      <ToastContainer icon={false} limit={1} autoClose={2000} />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}