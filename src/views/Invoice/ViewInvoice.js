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
      invoice_by_pk(id: $id) {
        invoice_number
        invoice_option {
          title
        }
        invoice_status {
          title
        }
        invoice_entity {
          title
        }
        invoice_user {
          first_name
          last_name
        }
        invoice_vendor {
          name
          address
        }
        invoice_uploading_status {
          title
        }
        uploading_status
        invoice_files {
          alfresco_url
          oracle_document_identifier
        }
      }    
    }
`;

const initValues = {
  id: "",
  invoice_number: "",
  entity: "",
  vendor: "",
  uploading_status: "",
  status: "",
  options : "",
  alfresco_url: "",
  oracle_document_identifier: ""  
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
        setDefaultValues( {
            id: pid,
            invoice_number: data.invoice_by_pk.invoice_number ? data.invoice_by_pk.invoice_number : "",
            vendor: data.invoice_by_pk.invoice_vendor ? data.invoice_by_pk.invoice_vendor.name : "",
            entity: data.invoice_by_pk.invoice_entity ? data.invoice_by_pk.invoice_entity.title : "",
            status: data.invoice_by_pk.invoice_status ? data.invoice_by_pk.invoice_status.title : "",
            options: data.invoice_by_pk.invoice_option ? data.invoice_by_pk.invoice_option.title : "",
            uploading_status: data.invoice_by_pk.invoice_uploading_status ? data.invoice_by_pk.invoice_uploading_status.title : "",
            alfresco_url: data.invoice_by_pk.invoice_files[0] ? data.invoice_by_pk.invoice_files[0].alfresco_url : "",
            oracle_document_identifier: data.invoice_by_pk.invoice_files ? data.invoice_by_pk.invoice_files.oracle_document_identifier : "",
        })
    }
  }, [data]); 

  return (
    <MainCard title={<><IconButton color="primary" onClick={() => navigate(-1)} sx={{ p:0, fontSize: "14px"}}>
            <IconChevronLeft />
          </IconButton>View Invoice</> }>
        <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
            <Typography variant="h5">Invoice Number:</Typography>
            <Typography variant="p">
                {
                    defaultValues.invoice_number
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
            <Typography variant="h5">Entity:</Typography>
            <Typography variant="p">
                {
                    defaultValues.entity
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
            <Typography variant="h5">Processing Option:</Typography>
            <Typography variant="p">
                {
                    defaultValues.options
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
