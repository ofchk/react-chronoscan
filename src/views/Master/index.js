import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import EntityList from './entitylist';
import VendorList from './vendorlist';
import CurrencyList from './currencylist';
import Status from './status';
import { Link } from 'react-router-dom';

import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Master() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard title="Master Data">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Master Tables">
          <Tab label="Vendor" {...a11yProps(0)} />
          <Tab label="Entity" {...a11yProps(1)} />
          <Tab label="Currency" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box align="right">
          <Button
            component={Link}
            to="/master/create/vendor"
            variant="contained"
            align="right"
            sx={{ mb: 2 }}
            size="small"
          >
            Create Vendor
          </Button>
        </Box>  
        <VendorList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box align="right">
          <Button
            component={Link}
            to="/master/create/entity"
            variant="contained"
            align="right"
            sx={{ mb: 2 }}
            size="small"
          >
            Create Entity
          </Button>
        </Box>  
        <EntityList />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box align="right">
          <Button
            component={Link}
            to="/master/create/currency"
            variant="contained"
            align="right"
            sx={{ mb: 2 }}
            size="small"
          >
            Create Currency
          </Button>
        </Box>  
        <CurrencyList />
      </TabPanel>
    </MainCard>
  );
}
