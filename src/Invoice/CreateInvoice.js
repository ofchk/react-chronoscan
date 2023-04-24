import React from 'react';

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
    mutation Invoice($created_by: Int!, $invoice_number: String!, $vendor: Int!, $entity: Int!, $status: Int!, $option: Int!) {
          insert_profile_one(object: {
            created_by: $created_by, 
            invoice_number: $invoice_number, 
            vendor: $vendor, 
            entity: $entity, 
            status: $status, 
            option: $option}) {
            id
            invoice_number
          }
        }
`;

export default function Create() {
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET);
  const [insert, { data: inserData, error: insertError }] = useMutation(INSERT);

  return (
    <Box component="span">
      <h3 align="center">Create Invoice</h3>
      <Formik
        initialValues={{
          invoice_number: '',
          vendor: '',
          entity: '',
          status: '',
          options: '',
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
            <Select
              name="vendor"
              size="small"
              onChange={handleChange}
              value={values.vendor}
              fullWidth
              displayEmpty
              required
              sx={{ mt: 2 }}
            >
              <MenuItem onChange={handleChange} value="">
                - Select Vendor -
              </MenuItem>
              {data &&
                data.vendor &&
                data.vendor.map((item, index) => (
                  <MenuItem onChange={handleChange} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
            <Select
              name="entity"
              size="small"
              onChange={handleChange}
              value={values.entity}
              fullWidth
              displayEmpty
              required
              sx={{ mt: 2 }}
            >
              <MenuItem onChange={handleChange} value="">
                - Select Entity -
              </MenuItem>
              {data &&
                data.entity &&
                data.entity.map((item, index) => (
                  <MenuItem onChange={handleChange} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
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
              sx={{ mt: 2 }}
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
