import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';

export default function Create() {
  const navigate = useNavigate();

  return (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <h1>Create Invoice</h1>
          <Formik
            initialValues={{ invoice_number: '', password: '' }}
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
                  name="invoice_number"
                  label="Enter Invoice Number"
                  variant="outlined"
                  size="small"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.invoice_number}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                {errors.email && touched.email && errors.email}
                <TextField
                  name="vendor"
                  label="Select Vendor"
                  variant="outlined"
                  size="small"
                  type="vendor"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.vendor}
                  required
                  fullWidth
                  sx={{ mt: 2 }}
                />
                {errors.vendor && touched.vendor && errors.vendor}
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
        </CardContent>
      </Card>
    </Box>
  );
}
