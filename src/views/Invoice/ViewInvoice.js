import React, { useEffect, useState } from 'react';

import { API_URL } from 'config';
import { Link } from 'react-router-dom';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from 'ui-component/extended/Chip';

import { IconChevronLeft, IconCopy } from '@tabler/icons';

import { IconButton, Typography, Divider, Stack, Tooltip } from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import Moment from 'moment';

const GET = gql`
    query Get($id: Int!) {
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
      currency{
        id
        title
      }   
      error_logs(where: {invoice_id: {_eq: $id}}) {
        message
      }
      invoice_by_pk(id: $id) {
        invoice_number
        invoice_amount
        gl_date
        oracle_document_identifier  
        description    
        tax  
        invoice_option {
          title
        }
        invoice_status {
          title
        }
        invoice_entity {
          title
        }    
        invoice_currency {
          title
        }
        invoice_user {
          first_name
          last_name
        }
        invoice_vendor {
          name
          address
          number
          site_code
          supplier_name
          supplier_number
        }
        invoice_uploading_status {
          title
        }
        uploading_status
        invoice_files {
          alfresco_url
        }
      }    
    }
`;

const initValues = {
  id: "",
  invoice_number: "",
  description: "",
  invoice_amount: "",
  gl_date: "",
  currency: "",
  entity: "",
  vendor: "",
  vendor_number: "",
  uploading_status: "",
  status: "",
  options : "",
  alfresco_url: "",
  oracle_document_identifier: "" ,
  error_log: "" ,
  tax: "" 
}


export default function ViewInvoice() {
  
  const theme = useTheme();
  const navigate = useNavigate();
  const [item, setItem] = React.useState();

  const params = useParams()
  const pid  = params.id;

  const { loading, data, refetch } = useQuery(GET, {
      variables: {
          id : pid
      }
  });
  const [defaultValues, setDefaultValues] = React.useState({ ...initValues });


  useEffect(() => {        
    if(data){
        console.log(data.error_logs)

        setDefaultValues( {
            id: pid,
            invoice_number: data.invoice_by_pk.invoice_number ? data.invoice_by_pk.invoice_number : "",
            description: data.invoice_by_pk.description ? data.invoice_by_pk.description : "",            
            invoice_amount: data.invoice_by_pk.invoice_amount ? data.invoice_by_pk.invoice_amount : "",
            tax: data.invoice_by_pk.tax ? data.invoice_by_pk.tax : "",
            gl_date: data.invoice_by_pk.gl_date ? data.invoice_by_pk.gl_date : "",
            currency: data.invoice_by_pk.invoice_currency ? data.invoice_by_pk.invoice_currency.title : "",
            vendor: data.invoice_by_pk.invoice_vendor ? data.invoice_by_pk.invoice_vendor.supplier_name : "",
            vendor_number: data.invoice_by_pk.invoice_vendor ? data.invoice_by_pk.invoice_vendor.supplier_number : "",
            entity: data.invoice_by_pk.invoice_entity ? data.invoice_by_pk.invoice_entity.title : "",
            status: data.invoice_by_pk.invoice_status ? data.invoice_by_pk.invoice_status.title : "",
            options: data.invoice_by_pk.invoice_option ? data.invoice_by_pk.invoice_option.title : "",
            uploading_status: data.invoice_by_pk.invoice_uploading_status ? data.invoice_by_pk.invoice_uploading_status.title : "",
            alfresco_url: data.invoice_by_pk.invoice_files[0] ? data.invoice_by_pk.invoice_files[0].alfresco_url : "",
            oracle_document_identifier: data.invoice_by_pk.oracle_document_identifier ? data.invoice_by_pk.oracle_document_identifier : "",
            number: data.invoice_by_pk.invoice_vendor ? data.invoice_by_pk.invoice_vendor.number : "",
            site_code: data.invoice_by_pk.invoice_vendor ? data.invoice_by_pk.invoice_vendor.site_code : "",
            error_log: data.error_logs.length > 0 ? data.error_logs[0].message : ""
        })
    }
  }, [data]); 

  return (
    <MainCard title={<><IconButton color="primary" onClick={() => navigate(-1)} sx={{ p:0, fontSize: "14px"}}>
            <IconChevronLeft />
          </IconButton>View Invoice</> }>
          {
            defaultValues.error_log &&
            <Typography  sx={{ backgroundColor: 'red', p:1 }} color="#FFFFFF" align="center" variant="h4">{defaultValues.error_log}</Typography>
          }

          
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Invoice Number:</Typography>
            <Typography variant="p">
                {
                    defaultValues.invoice_number
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Description:</Typography>
            <Typography variant="p">
                {
                    defaultValues.description
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Vendor:</Typography>
            <Typography variant="p">
                {
                    defaultValues.vendor
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Vendor Number:</Typography>
            <Typography variant="p">
                {
                    defaultValues.vendor_number
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Vendor Site Code/ID:</Typography>
            <Typography variant="p">
                {
                    defaultValues.site_code
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Entity:</Typography>
            <Typography variant="p">
                {
                    defaultValues.entity
                }
                </Typography>
        </Stack>

        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Currency:</Typography>
            <Typography variant="p">
                {
                    defaultValues.currency
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Invoice Amount:</Typography>
            <Typography variant="p">
                {
                    defaultValues.invoice_amount
                }
                </Typography>
        </Stack>

        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Tax Applicable:</Typography>
            <Typography variant="p" sx={{ textTransform: "capitalize"}}>
                {
                    defaultValues.tax
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">GL Date:</Typography>
            <Typography variant="p">
                {
                    Moment(defaultValues.gl_date).format('DD-MMM-YYYY')
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Processing Option:</Typography>
            <Typography variant="p">
                {
                    defaultValues.options
                }
                </Typography>
        </Stack>

        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Processing Status:</Typography>
            <Typography variant="p" color={(defaultValues.status === "New") ? "primary"  : (defaultValues.status === "Processing" ? "warning"  : (defaultValues.status === "Completed" ? "success"  : "error")) }>
                {
                    defaultValues.status
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Uploading Status:</Typography>
            <Typography variant="p" color={(defaultValues.uploading_status == "Completed") ? "success"  : "error" }>
                {
                    defaultValues.uploading_status
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Alfresco URL:</Typography>
            <Typography variant="p">
                {
                  defaultValues.alfresco_url &&
                  <>
                    <Tooltip title="Copy"><IconButton 
                      onClick={() => {navigator.clipboard.writeText(defaultValues.alfresco_url)}}
                      sx={{ p:0, fontSize: "14px"}}>
                       <IconCopy color = "#C59627" />
                    </IconButton></Tooltip>
                    <Link color="primary" to={defaultValues.alfresco_url} target="_blank">
                      {defaultValues.alfresco_url}
                    </Link>
                  </>
                }
                </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Oracle Document Identifier:</Typography>
            <Typography variant="p">
                {
                    defaultValues.oracle_document_identifier
                }
                </Typography>
        </Stack>

        
        <Divider sx={{ borderColor: theme.palette.grey[300] }} />
    </MainCard>
  );
}
