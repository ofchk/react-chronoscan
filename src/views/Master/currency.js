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
          currency {
            id
            title
          }          
        }
`;

const INSERT = gql`
    mutation Currency($created_by: Int!, $title: String!) {
      insert_currency_one(object: {
        created_by: $created_by, 
        title: $title}) {
          id
          title
      }
    } 
`;

export default function Currency() {
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
          </IconButton>Create Currency</> }>
    <Box align="right">
      <Formik
        initialValues={{ name: '', address: '' }}
        onSubmit={(values, { setSubmitting }) => {
          if(values){
              insert({
                variables: {
                  title: values.title,
                  created_by: 1
                }
              })
              successMessage(values.title);              
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
