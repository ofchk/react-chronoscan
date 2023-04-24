import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';

export default function Status() {
  const navigate = useNavigate();

  return (
    <Box component="span">
      <h3 align="center">Create Status</h3>
      <Formik
        initialValues={{ title: '' }}
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
              name="title"
              label="Enter Title"
              variant="outlined"
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            {errors.title && touched.title && errors.title}
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
