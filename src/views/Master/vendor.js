import React, { useEffect, useState } from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { IconButton,
          Select,
          MenuItem,
          InputLabel
} from '@mui/material';
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
          vendor_process {
            id
            title
          }          
        }
`;

const INSERT = gql`
    mutation Vendor($created_by: Int!, $name: String!, $number: String!, $site_code: String!, $address: String!, $vendor_process: Int!) {
      insert_vendor_one(object: {
        created_by: $created_by, 
        name: $name, 
        number: $number, 
        site_code: $site_code, 
        address: $address,
        vendor_process: $vendor_process
      }) {
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

  const errorMessage = (msg) => {
    dispatch(
      openSnackbar({
        open: true,
        message: msg,
        variant: 'alert',
        alert: {
          color: 'primary'
        },
        close: true
      })
    )
  }

  useEffect(() => {        
    if(insertData){
        successMessage(insertData.insert_vendor_one.name)
    }
    if(insertError){
        errorMessage("Some error occured. Check your internet connection or Contact Administrator.") 
    }
  }, [insertData, insertError]); 

  return (
    <MainCard title={<><IconButton color="primary" onClick={() => navigate(-1)} sx={{ p:0, fontSize: "14px"}}>
            <IconChevronLeft />
          </IconButton>Create Vendor</> }>
      <Box>
        <Formik
          initialValues={{ name: '', address: '', vendor_process: '', number: '', site_code: ''  }}
          onSubmit={(values, { setSubmitting }) => {
            if(values){
              insert({
                variables: {
                  name: values.name,
                  number: values.number,
                  site_code: values.site_code,
                  name: values.name,
                  address: values.address,
                  vendor_process: values.vendor_process,
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
              <InputLabel sx={{ color: '#222', fontSize: '14px', marginBottom: '5px' }}>
                Vendor Name:
              </InputLabel>
              <TextField
                name="name"
                variant="outlined"
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              {errors.name && touched.name && errors.name}
              <InputLabel sx={{ color: '#222', fontSize: '14px', marginBottom: '5px' }}>
                Address
              </InputLabel>
              <TextField
                name="address"
                variant="outlined"
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                fullWidth
                sx={{ mb: 2 }}
              />
              {errors.address && touched.address && errors.address}
              <InputLabel sx={{ color: '#222', fontSize: '14px', marginBottom: '5px' }}>
                Vendor Number:
              </InputLabel>
              <TextField
                name="number"
                variant="outlined"
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.number}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              {errors.number && touched.number && errors.number}
              <InputLabel sx={{ color: '#222', fontSize: '14px', marginBottom: '5px' }}>
                Vendor Site Id / Code:
              </InputLabel>
              <TextField
                name="site_code"
                variant="outlined"
                size="small"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.site_code}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              {errors.site_code && touched.site_code && errors.site_code}
              <InputLabel sx={{ color: '#222', fontSize: '14px', marginBottom: '5px' }}>
                Process Available
              </InputLabel>
              <Select
                name="vendor_process"
                size="small"
                onChange={handleChange}
                value={values.vendor_process}
                fullWidth
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem onChange={handleChange} value="">
                  - Select Process Available -
                </MenuItem>
                {data &&
                  data.vendor_process &&
                  data.vendor_process.map((item, index) => (
                    <MenuItem onChange={handleChange} value={item.id} key={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
              </Select>
            
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
