import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Moment from 'moment';

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

import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

const GET = gql`
    query Get {
      invoice (order_by: {created_at: desc}){
        id
        invoice_number
        vendor
        entity
        option
        status
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
      }         
        }
`;

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

export default function List() {
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET);

  const rowSet = [];
  if (data) {
    data.invoice.forEach((item) => {
      rowSet.push({
        id: item.id,
        invoice_number: item.invoice_number,
        vendor: item.invoice_vendor ? item.invoice_vendor.name : '-',
        entity: item.invoice_entity ? item.invoice_entity.title : '-',
        status: item.invoice_status ? item.invoice_status.title : '-',
        option: item.invoice_option ? item.invoice_option.title : '-',
        created_at: item.created_at
          ? Moment(item.created_at).format('DD MMM YYYY hh:mm a')
          : '-',
      });
    });
  }
  const columnSet = [
    { field: 'id', headerName: 'ID' },
    { field: 'invoice_number', headerName: 'Invoice Number', width: 200 },
    { field: 'vendor', headerName: 'Vendor', width: 200 },
    { field: 'entity', headerName: 'Entity', width: 200 },
    { field: 'option', headerName: 'Processing Option', width: 300 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
  ];
  return (
    <Box align="right">
      <Button
        component={Link}
        to="/createinvoice"
        variant="contained"
        align="right"
        sx={{ mb: 2 }}
        size="small"
      >
        Create Invoice
      </Button>
      <h3 align="center">Invoices</h3>

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
