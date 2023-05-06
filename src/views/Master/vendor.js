import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import MainCard from 'ui-component/cards/MainCard';
import { IconChevronLeft } from '@tabler/icons';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

const GET = gql`
    query Get {
          vendor {
            id
            name
            address
          }          
        }
`;

const INSERT = gql`
    mutation Vendor($created_by: Int!, $name: String!, $address: String!) {
      insert_vendor_one(object: {
        created_by: $created_by, 
        name: $name, 
        address: $address}) {
          id
          name
      }
    } 
`;

export default function Vendor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, data, refetch } = useQuery(GET);
  const [ insert, { data: insertData, error: insertError }] = useMutation(INSERT);

  const successMessage = (param) => {
    dispatch(
      openSnackbar({
        open: true,
        message: param + ' - Created Successfully ',
        variant: 'alert',
        alert: {
          color: 'primary'
        },
        close: true
      })
    )
  }

  const errorMessage = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: ' Process Failed !. Please check your network or Contact Administrator.',
        variant: 'alert',
        alert: {
          color: 'primary'
        },
        close: true
      })
    )
  }

  return (
    <MainCard title={<><IconButton color="primary" onClick={() => navigate(-1)} sx={{ p:0, fontSize: "14px"}}>
            <IconChevronLeft />
          </IconButton>Create Vendor</> }>
      <Box align="right">
        <Formik
          initialValues={{ name: '', address: '' }}
          onSubmit={(values, { setSubmitting }) => {
            if(values){
              insert({
                variables: {
                  name: values.name,
                  address: values.address,
                  created_by: 1
                }
              })
              successMessage(values.name);              
              navigate('/master');
            }else{
              errorMessage()
            }
            
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
      </Box>
    </MainCard>
  );
}
