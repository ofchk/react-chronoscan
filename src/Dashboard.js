import React from 'react';
import './style.css';

import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Dashboard() {
  return (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <h1>Welcome to, Dashboard!</h1>
        </CardContent>
      </Card>
    </Box>
  );
}
