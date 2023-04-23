import React from 'react';
import './style.css';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';
import Dashboard from './Signin';

export default function Signin() {
  const navigate = useNavigate();

  return (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <h1>Welcome to, Muscat Overseas!</h1>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              navigate('/dashboard');
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  id="email"
                  name="email"
                  label="Enter Email"
                  variant="outlined"
                  size="small"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                {errors.email && touched.email && errors.email}
                <TextField
                  id="password"
                  name="password"
                  label="Enter password"
                  variant="outlined"
                  size="small"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  required
                  fullWidth
                  sx={{ mt: 2 }}
                />
                {errors.password && touched.password && errors.password}
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                >
                  SignIn
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
}
