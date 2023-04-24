import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';

export default function Vendor() {
  const navigate = useNavigate();

  return (
    <Box component="span">
      <h3 align="center">Create Vendor</h3>
      <Formik
        initialValues={{ name: '', address: '' }}
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
              name="name"
              label="Enter Name"
              variant="outlined"
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            {errors.name && touched.name && errors.name}
            <TextField
              name="address"
              label="Enter Address"
              variant="outlined"
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
              fullWidth
              sx={{ mt: 2 }}
            />
            {errors.address && touched.address && errors.address}
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              disabled={isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}
