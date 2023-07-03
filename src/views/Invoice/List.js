import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Moment from 'moment';
import { Checkbox, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup } from '@mui/material';
import Chip from 'ui-component/extended/Chip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { TextField, CircularProgress, LinearProgress, Typography} from '@mui/material';
import { linearProgressClasses } from '@mui/material/LinearProgress';

import { IconFileText, IconUpload, IconChecks, IconExclamationCircle } from '@tabler/icons';

import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbar,
} from '@mui/x-data-grid';

import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

const GET = gql`
    query Get($email: String!) {
      invoice (where: {created_email: {_eq: $email}}, order_by: {created_at: desc}){
        id
        invoice_number
        vendor
        entity
        option
        status
        uploading_status
        created_at
        invoice_vendor{
          name
        }
        invoice_entity{
          title
        }
        
        invoice_status{
          title
        }
        invoice_option{
          title
        }        
        invoice_uploading_status {
          title
        }
        invoice_error_logs {
          message
        }
      }         
    }
`;


export default function List() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log(user)

  const { loading, data, refetch } = useQuery(GET, {
    variables: {
      email: user ? user.email_id : ''
    }
  });

  const [filter, setFilter] = useState({
        items: [
        ]
  });

  const [showProcessedOnly, setShowProcessedOnly] = useState(false);
  const [showUploadedOnly, setShowUploadedOnly] = useState(false);

  const handleClearFilters = () => {
    setFilter({
      items: []
    });
  };
  
  function CustomToolbar() {
    return (
      <>
        <GridToolbarContainer>
{/*    
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton
             
          /> */}
          <GridToolbarExport />
        </GridToolbarContainer>
      </>
    );
  }
  

  const rowSet = [];
  if (data) {
    data.invoice.forEach((item) => {
      rowSet.push({
        id: item.id,
        invoice_number: item.invoice_number,
        vendor: item.invoice_vendor ? item.invoice_vendor.name : '-',
        // entity: item.invoice_entity ? item.invoice_entity.title : '-',
        status: item.invoice_status ? item.invoice_status.title : '-',
        uploading_status: item.invoice_uploading_status ? item.invoice_uploading_status.title : '-',
        created_at: item.created_at
          ? Moment(item.created_at).format('DD MMM YYYY hh:mm a')
          : '-',
      });
    });
  }
  const columnSet = [
    { field: 'id', 
      headerName: 'View', 
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <><IconButton color="primary" aria-label="View Invoice" component={Link} to={"/invoice/view/"+params.row.id}>            
            <IconFileText />
          </IconButton></>
          
        );
      } 
    },
    { field: 'invoice_number', headerName: 'Invoice Number', width: 200 },
    { field: 'vendor', headerName: 'Vendor', width: 200 },
    // { field: 'entity', headerName: 'Entity', width: 200 },
    { field: 'status', headerName: 'Processing Status', width: 200,
      renderCell: (params) => {
        return (
          <Chip label={params.row.status} chipcolor={(params.row.status === "New") ? "primary"  : ((params.row.status === "Processing") ? "warning"  : ((params.row.status === "Completed") ? "success"  : ("error"))) } />
        );
      } 
    },
    { field: 'uploading_status', headerName: 'Uploading Status', width: 200,
      renderCell: (params) => {
        return (
          <>
          {
            (params.row.uploading_status == "Not Completed") &&            
              <Chip chipcolor="warning" label="In Progress" avatar={<IconUpload fontSize="small" color="orange" />} />            
          }
          {
            (params.row.uploading_status == "Completed") &&            
            <Chip chipcolor="success" label="Completed" avatar={<IconChecks fontSize="small" color="green" />} />            
          }
          {
            (params.row.uploading_status == "Failed") &&            
            <Chip chipcolor="error" label="Failed" avatar={<IconExclamationCircle fontSize="small" color="red" />} />            
          }
          </>
        );
      }  },
    { field: 'created_at', headerName: 'Created On', width: 200 },
  ];

  const handleQuickFilter = (processingDone, uploadDone) =>  {
    var newItems = filter.items;
    if (!uploadDone) {
      newItems = newItems.filter((a) => a.columnField !== 'uploading_status');
    }
    if (!processingDone) {
      newItems = newItems.filter((a) => a.columnField !== 'status');
    }

    if (uploadDone) {
      setFilter({
        items:  [
          {id: 1, columnField: 'uploading_status', operatorValue: 'equals', value: 'Completed'}
        ]
      })
      setShowProcessedOnly(false);
    } else if (processingDone) {
      setFilter({
        items:  [
          {id: 2, columnField: 'status', operatorValue: 'equals', value: 'Completed'}
        ]
      })
      setShowUploadedOnly(false);
    } else{
        setFilter({
          items: newItems
        })
      }
    }


 
  return (
      <MainCard title="List Invoices">
        <Box align="right">
        <FormControlLabel
          label="Show upload completed"
            control={<Checkbox
            checked={showUploadedOnly}
            onChange={(event, checked) => {
              if (checked) {
                handleQuickFilter(false, true)
              } else {
                handleQuickFilter(false, false)
              }
              setShowUploadedOnly(checked)
              setShowProcessedOnly(!checked)
            }} 
        />}></FormControlLabel>
        <FormControlLabel
          label="Show process completed"
            control={<Checkbox
            checked={showProcessedOnly}
            onChange={(event, checked) => {
              if (checked) {
                handleQuickFilter(true, false)
              } else {
                handleQuickFilter(false, false)
              }
              setShowUploadedOnly(!checked)
              setShowProcessedOnly(checked)
            }} 
        />}></FormControlLabel>
          <Button
            component={Link}
            to="/invoice/create"
            variant="contained"
            align="right"
            sx={{ mb: 2 }}
            size="small"
          >
            Create Invoice
          </Button>
        </Box>  

       

        <DataGrid
          rows={rowSet}
          filterModel={filter}
          columns={columnSet}
          m={2}
          pageSize={15}
          components={{
            Toolbar: CustomToolbar,
          }}
          autoHeight={true}
        > <Checkbox></Checkbox></DataGrid>
      </MainCard>
  );
}
