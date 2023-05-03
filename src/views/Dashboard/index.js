
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import { Button, Grid, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, Typography } from '@mui/material';

import RecentInvoices from './RecentInvoices';
import RecentVendors from './RecentVendors';
import { useTheme } from '@mui/material/styles';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

// ==============================|| SAMPLE PAGE ||============================== //

const Dashboard = () => (
    <MainCard  title="Dashboard" sx={{ backgroundColor: "#fff"}}>         
        <Box sx={{ mb: 10 }}>
            <RecentInvoices/>
        </Box>
        <RecentVendors />

    </MainCard>
);

export default Dashboard;
