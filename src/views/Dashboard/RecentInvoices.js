import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Moment from 'moment';
import Chip from 'ui-component/extended/Chip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { IconFileText } from '@tabler/icons';

import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
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
      invoice (order_by: {created_at: desc}, limit: 10){
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
      }         
    }
`;

function CustomToolbar() {
  return (
    <>
      <GridToolbarContainer>
      </GridToolbarContainer>
    </>
  );
}

export default function RecentInvoices() {
  const theme = useTheme();
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
        uploading_status: item.invoice_uploading_status ? item.invoice_uploading_status.title : '-',
        created_at: item.created_at
          ? Moment(item.created_at).format('DD MMM YYYY hh:mm a')
          : '-',
      });
    });
  }
  const columnSet = [
    
    { field: 'invoice_number', headerName: 'Invoice Number', width: 200 },
    { field: 'vendor', headerName: 'Vendor', width: 200 },
    { field: 'entity', headerName: 'Entity', width: 200 },
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
          <Chip label={params.row.uploading_status} chipcolor={(params.row.uploading_status == "Completed") ? "success"  : "error" }/>
        );
      }  },
    { field: 'created_at', headerName: 'Created On', width: 200 },
  ];
  return (
      <MainCard title="Recent Invoices">
        <DataGrid
          rows={rowSet}
          columns={columnSet}
          m={2}
          pageSize={10}
          components={{
            Toolbar: CustomToolbar,
          }}
          autoHeight="true"
          hideFooterPagination="true"
        />
        <Button color="primary" aria-label="View Invoice" component={Link} to={"/invoice/list"}>            
            View More
        </Button>
      </MainCard>
  );
}