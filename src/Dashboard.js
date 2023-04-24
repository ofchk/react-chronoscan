import React from 'react';
import './style.css';

import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <h3 align="center">Welcome to Dashboard</h3>
    </Box>
  );
}
