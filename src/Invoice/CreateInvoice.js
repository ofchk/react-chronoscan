import React, { useEffect } from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';

import { useNavigate } from 'react-router-dom';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

const GET = gql`
    query Get {
      vendor{
        id
        name
      }
      entity{
        id
        title
      }
      status{
        id
        title
      }
      options{
        id
        title
      }       
    }
`;

const INSERT = gql`
    mutation Invoice($created_by: Int!, $invoice_number: String!, $vendor: Int!, $entity: Int!, $status: Int!, $options: Int!) {
          insert_invoice_one(object: {
            created_by: $created_by, 
            invoice_number: $invoice_number, 
            vendor: $vendor, 
            entity: $entity, 
            status: $status, 
            option: $options}) {
            id
            invoice_number
          }
        }
`;

export default function Create() {
  const apiUrl = 'http://192.168.5.130:3010';
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET);
  const [insertInvoice, { data: insertData, error: insertError }] =
    useMutation(INSERT);

  const handleFileUpload = async (formData) => {
      if(formData){
          uploadingMessage();
          await fetch(`http://192.168.5.130:3010/invoice/upload`, {
              method: 'post',
              body: formData,
          })
          .then(response =>  response.json())
          .then(data => {                
            return false;
          })    
      }        
    }

    const uploadHandler = (invoice_file) => {
        const formData = new FormData();

        formData.append('file', invoice_file);  
        handleFileUpload(formData)
    }

  return (
    <Box component="span">
      <h3 align="center">Create Invoice</h3>
      <Formik
        initialValues={{
          created_by: 1,
          invoice_number: '',
          vendor: '',
          entity: '',
          status: '',
          options: '',
          invoice_file: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values) {
            insertInvoice({
              variables: values,
            });
            uploadHandler(values.invoice_file);
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
              name="invoice_number"
              label="Enter Invoice Number"
              variant="outlined"
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.invoice_number}
              fullWidth
              required
            />
            <Autocomplete
              disablePortal
              options={data && data.vendor}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                values.vendor = newValue.id;
                // console.log(newValue);
              }}
              name="vendor"
              size="small"
              renderInput={(params) => (
                <TextField
                  sx={{ mt: 2 }}
                  {...params}
                  fullWidth
                  label="Select Vendor"
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={data && data.entity}
              getOptionLabel={(option) => option.title}
              onChange={(event, newValue) => {
                values.entity = newValue.id;
                // console.log(newValue);
              }}
              name="entity"
              size="small"
              renderInput={(params) => (
                <TextField
                  sx={{ mt: 2 }}
                  {...params}
                  fullWidth
                  label="Select Entity"
                />
              )}
            />
            <Select
              name="options"
              size="small"
              onChange={handleChange}
              value={values.options}
              fullWidth
              displayEmpty
              required
              sx={{ mt: 2 }}
            >
              <MenuItem onChange={handleChange} value="">
                - Select Processing Option -
              </MenuItem>
              {data &&
                data.options &&
                data.options.map((item, index) => (
                  <MenuItem onChange={handleChange} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
            <Select
              name="status"
              size="small"
              onChange={handleChange}
              value={values.status}
              fullWidth
              displayEmpty
              required
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem onChange={handleChange} value="">
                - Select Status -
              </MenuItem>
              {data &&
                data.status &&
                data.status.map((item, index) => (
                  <MenuItem onChange={handleChange} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
            <InputLabel sx={{ mb: 1, color: '#222', fontSize: '16px' }}>
              Upload Invoice File:{' '}
            </InputLabel>
            <input
              type="file"
              sx={{ mt: 2 }}
              name="invoice_file"
              accept="application/pdf"
              required
              onChange={handleChange}
            />
            <InputLabel sx={{ mt: 2, mb: 1, color: '#222', fontSize: '16px' }}>
              Associated Document 1:{' '}
            </InputLabel>
            <input
              type="file"
              sx={{ mt: 2 }}
              name="other_1"
              accept="application/pdf"
              onChange={handleChange}
            />
            <InputLabel sx={{ mt: 2, mb: 1, color: '#222', fontSize: '16px' }}>
              Associated Document 2:{' '}
            </InputLabel>
            <input
              type="file"
              sx={{ mt: 2 }}
              name="other_2"
              accept="application/pdf"
            />
            <InputLabel sx={{ mt: 2, mb: 1, color: '#222', fontSize: '16px' }}>
              Associated Document 3:{' '}
            </InputLabel>
            <input
              type="file"
              sx={{ mt: 2 }}
              name="other_3"
              accept="application/pdf"
            />
            <Box align="right">
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                disabled={isSubmitting}
                type="submit"
                size="small"
              >
                Create
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
