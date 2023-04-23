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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card>
            <nav>
              <ul>
                <li>
                  <Link to="/invoice">Invoice</Link>
                </li>
                <li>
                  <Link to="/">Sign Out</Link>
                </li>
              </ul>
            </nav>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <h1>Welcome to Dashboard</h1>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
