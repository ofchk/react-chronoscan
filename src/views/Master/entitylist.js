import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { TextField, IconButton } from '@mui/material';
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


import { IconTrash } from '@tabler/icons';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

const GET = gql`
    query Get {
          entity {
            id
            title
          }          
        }
`;

const DELETE = gql`
    mutation DELETE($id: Int!) {
      delete_entity_by_pk(id: $id) {
        id
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
  const dispatch = useDispatch();
  const { loading, data, refetch } = useQuery(GET);
  const [ deleteItem, { data: deleteData, error: deleteError }] = useMutation(DELETE);
  
  const successMessage = (param) => {
    dispatch(
      openSnackbar({
        open: true,
        message: param + ' - Deleted Successfully ',
        variant: 'alert',
        alert: {
          color: 'primary'
        },
        close: true
      })
    )
  }

  const errorMessage = (message) => {
    dispatch(
      openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: {
          color: 'error'
        },
        close: true
      })
    )
  }

  useEffect(() => {        
    if(deleteData){
        refetch()
        successMessage(deleteData.delete_entity_by_pk.id)
    }
    if(deleteError){
      // if(deleteError.graphQLErrors[0].message.includes("Uniqueness violation")){
      if(deleteError.graphQLErrors[0].message.includes("Foreign key violation")){        
        errorMessage("Delete Failed !. This entity is used in Invoice created.")
      }
      else{
        errorMessage("Some error occured. Check your internet connection or Contact Administrator.") 
      }
    }
  }, [deleteData, deleteError]); 

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
    { field: 'title', headerName: 'Title', width: 700 },
    { field: 'id', headerName: 'Action', disableClickEventBubbling: true, 
    renderCell: (params) => {
        return (
          <IconButton color="error" aria-label="Delete Entity" 
            onClick={() => {
              deleteItem({
                variables: {
                  id: params.row.id
                }
              })
            }}
          >
            <IconTrash />
          </IconButton>
        );
      } 
    },
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
