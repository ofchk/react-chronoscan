import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Entity from './entity';
import Vendor from './vendor';
import Options from './options';
import Status from './status';

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
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Master  Tables">
          <Tab label="Vendor" {...a11yProps(0)} />
          <Tab label="Entity" {...a11yProps(1)} />
          <Tab label="Options" {...a11yProps(2)} />
          <Tab label="Status" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Vendor />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Entity />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Options />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Status />
      </TabPanel>
    </Box>
  );
}
