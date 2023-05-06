import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
          entity {
            id
            title
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

export default function Entity() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { loading, data, refetch } = useQuery(GET);

  const rowSet = [];
  if (data) {
    data.entity.forEach((item) => {
      rowSet.push({
        id: item.id,
        title: item.title,
      });
    });
  }
  const columnSet = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Title', width: 200 },
  ];

  return (    
    <Box component="span" align="right">
      <DataGrid
        rows={rowSet}
        columns={columnSet}
        m={2}
        pageSize={15}
        components={{
          Toolbar: CustomToolbar,
        }}
        autoHeight="true"
        sx={{ mt: 2, boxShadow: theme.shadows[8] }}
      />
    </Box>  
  );
}
