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
            address
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
        address: item.address ? item.address : '-',
      });
    });
  }
  const columnSet = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 500 },
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
      <Box align="right" mt={2}><Button color="primary" aria-label="View Invoice" component={Link} to={"/master"}>            
        View More
      </Button></Box>
    </MainCard>
  );
}
