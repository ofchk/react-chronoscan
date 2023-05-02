import React, { useEffect, useState } from 'react';

import { API_URL } from 'config';

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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { FileUploader } from "react-drag-drop-files";

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
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

const INSERT_FILE = gql`
    mutation File($created_by: Int!, $invoice_number: String!, $filepath: String!, $filepath: String!, $nodeid: String!){
      insert_files_one(object: {alfresco_url: $filepath, created_by: 10, invoice_number: $invoice_number, name: $filepath, nodeid: $nodeid}) {
        id
        invoice_number
      }
    }

`;


const fileTypes = ["PDF"];

export default function Create() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [item, setItem] = React.useState();
  const [item1, setItem1] = React.useState();
  const [item2, setItem2] = React.useState();
  const [item3, setItem3] = React.useState();
  const { loading, data, refetch } = useQuery(GET);
  const [insertInvoice, { data: insertData, error: insertError }] = useMutation(INSERT);
  const [insertFile, { data: insertDataFile, error: insertErrorFile }] = useMutation(INSERT_FILE);
  const [file, setFile] = useState(null);
  
  const handleChange = (file) => {
    setFile(file);
  };

  const uploadSuccessMessage = (invoice_number) => {
    dispatch(
        openSnackbar({
            open: true,
            message: invoice_number + ' - File Uploaded Successfully ',
            variant: 'alert',
            alert: {
                color: 'primary'
            },
            close: true
        })
    )  
  }

  const existMessage = (msg) => {
    dispatch(
        openSnackbar({
            open: true,anchorOrigin: { vertical: 'top', horizontal: 'right' },
            message: msg,
            variant: 'alert',
            alert: {
                color: 'error'
            },
            close: true
        })
    )  
  }

  const handleFileUpload = async (formData) => {
      if(formData){
        await fetch(`${API_URL}/invoice/upload`, {
            method: 'post',
            body: formData,
        })
        .then(response =>  response.json())
        .then(data => {
          data.forEach((item) => {
              const uploadRes = item;
              const message = uploadRes.message;
              const status = uploadRes.status;
              if(status === 200){
                  console.log(uploadRes)             
                  const filename = uploadRes.filename;
                  const filepath = uploadRes.contentUrl;
                  const invoice_number = uploadRes.invoice_number;
                  const nodeid = uploadRes.nodeid;
                  uploadSuccessMessage(invoice_number);                       
                  
                  insertFile({ variables: {
                      'filename': filename,
                      'filepath': filepath,
                      'invoice_number': invoice_number,
                      'nodeid': nodeid,
                      'created_by': 1
                    } 
                  })
              }    
              if(status === 409){
                  const uploadRes = item;
                  const message = uploadRes.message;
                  existMessage(message);
              }
          })                
          return false;
        })    
      }        
  }

  const uploadHandler = (param, invoice) => {
    const formData = new FormData();
    formData.append('file', param);  
    formData.append('invoice', invoice);  
    handleFileUpload(formData)
  }

  return (
    <MainCard>
      <Formik
        initialValues={{
          created_by: 1,
          invoice_number: '',
          vendor: '',
          entity: '',
          status: 1,
          options: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values) {
            insertInvoice({
              variables: values,
            });
            
            if(file){
              console.log(file)
              uploadHandler(file,values.invoice_number);            
            }  
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
              value={1}
              fullWidth
              displayEmpty
              disabled
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

      <InputLabel sx={{ mb: 1, color: '#222', fontSize: '16px' }}>
        Upload Invoice File:{' '}
      </InputLabel>

      <Box>
        <FileUploader
          multiple={false}
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          maxSize={20}
        />
        <p>{file ? `File name: ${file.name}` : "No invoice file added yet. (Max Size: 20 MB)"}</p>
      </Box>


    </MainCard>
  );
}
