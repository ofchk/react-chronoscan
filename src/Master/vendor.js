import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <>
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    </>
  );
}

export default function Vendor() {
  const navigate = useNavigate();

  const rowSet = [];
  const columnSet = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
  ];
  return (
    <Box component="span" align="right">
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
              size="small"
            >
              Save
            </Button>
          </form>
        )}
      </Formik>
      <DataGrid
        rows={rowSet}
        columns={columnSet}
        m={2}
        pageSize={15}
        components={{
          Toolbar: CustomToolbar,
        }}
        autoHeight="true"
        sx={{ mt: 2, backgroundColor: '#f1f1f1' }}
      />
    </Box>
  );
}
