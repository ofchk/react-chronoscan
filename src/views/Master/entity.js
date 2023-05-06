import React from 'react';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import MainCard from 'ui-component/cards/MainCard';
import { IconChevronLeft } from '@tabler/icons';

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
    <MainCard title={<><IconButton color="primary" onClick={() => navigate(-1)} sx={{ p:0, fontSize: "14px"}}>
            <IconChevronLeft />
          </IconButton>Create Vendor</> }>
    <Box align="right">
      <Formik
        initialValues={{ name: '', address: '' }}
        onSubmit={(values, { setSubmitting }) => {
          navigate('/dashboard');
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
              name="title"
              label="Enter Title"
              variant="outlined"
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            {errors.title && touched.title && errors.title}

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              disabled={isSubmitting}
              type="submit"
              size="small"
            >
              Save
            </Button>
          </form>
        )}
      </Formik>      
    </Box>
    </MainCard>
  );
}
