
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import { Button, Grid, Card, CardActions, CardContent, 
            CardHeader, CardMedia, Divider, Typography } from '@mui/material';

import RecentInvoices from './RecentInvoices';
import RecentVendors from './RecentVendors';
import UserCountCard from 'ui-component/cards/UserCountCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material/styles';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

const GET = gql`
    query Get($id: Int!) {       
        user_invoice_today_aggregate(args: {ab: $id}) {
            aggregate {
              count
            }
          }
        user_invoice_week_aggregate(args: {ab: $id}) {
            aggregate {
              count
            }
        }  
    }
`;

// ==============================|| SAMPLE PAGE ||============================== //

export default function Dashboard() {
    const theme = useTheme();
    const { loading, data, refetch } = useQuery(GET, {
        variables: {
            id : localStorage.getItem('user_id')
        }
    });
  
    return (
      <MainCard  title="Dashboard" sx={{ backgroundColor: "#fff"}}>         
        <Box mb={3}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={6}>
                    <UserCountCard
                        primary="Total Invoice Processed Today"
                        secondary={data && data.user_invoice_today_aggregate.aggregate.count}
                        iconPrimary={DescriptionTwoToneIcon}
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} lg={6} sm={6}>
                    <UserCountCard
                        primary="Total Invoice Processed in the last 7 days"
                        secondary={data && data.user_invoice_week_aggregate.aggregate.count}
                        iconPrimary={CalendarMonthIcon}
                        color={theme.palette.primary.dark}
                    />
                </Grid>
            </Grid>
        </Box>
        <Box>
            <RecentInvoices/>
        </Box>
    </MainCard>
    );
}
