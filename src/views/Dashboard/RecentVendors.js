import React from 'react';

import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MainCard from 'ui-component/cards/MainCard';
import Typography from '@mui/material/Typography';

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
          vendor {
            id
            name
            supplier_name
            supplier_number
            site_code
            site_code_original
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

export default function RecentVendors() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET);

  const rowSet = [];
  if (data) {
    data.vendor.forEach((item) => {
      rowSet.push({
        id: item.id,
        name: item.name,
        supplier_name: item.supplier_name ? item.supplier_name : '-',
        supplier_number: item.supplier_number ? item.supplier_number : '-',
        site_code: item.site_code ? item.site_code : '-',
        site_code_original: item.site_code_original ? item.site_code_original : '-',
      });
    });
  }
  const columnSet = [
    { field: 'name', headerName: 'OU Name', width: 200 },
    { field: 'supplier_name', headerName: 'Supplier Name', width: 300 },
    { field: 'supplier_number', headerName: 'Supplier Number', width: 200 },
    { field: 'site_code', headerName: 'Site Id', width: 150 },
    { field: 'site_code_original', headerName: 'Site Code', width: 200 },
  ];
  return (
    <MainCard sx={{ boxShadow: theme.shadows[8] }}>
      <Typography component="h1" variant="h3" mb={2}> Recent Vendors </Typography>
      <DataGrid
        rows={rowSet}
        columns={columnSet}        
        pageSize={15}
        components={{
          Toolbar: CustomToolbar,
        }}
        autoHeight="true"
        hideFooterPagination="true"
      />
      
    </MainCard>
  );
}
