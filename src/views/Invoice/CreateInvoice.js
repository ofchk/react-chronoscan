import React, { useEffect, useState } from 'react';

import { API_URL } from 'config';

import { Formik } from 'formik';
import  { Box, 
          Card, 
          CardActions, 
          CardContent, 
          Button,
          TextField,
          Typography,
          Grid,
          Select,
          MenuItem,
          InputLabel,
          IconButton,
          Stack,
          Radio,
          FormLabel,
          RadioGroup,
          FormControl,
          FormControlLabel
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

import { FileUploader } from "react-drag-drop-files";
import { IconChevronLeft } from '@tabler/icons';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
import axiosServices from "utils/axios"
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { updateFileUploadList } from 'store/slices/menu';
import { FormHelperText } from '@mui/material';

import Moment from 'moment';


const GET = gql`
    query Get {
      vendor(distinct_on: org_id) {
        id
        org_id
      }
      entity{
        id
        title
        org_id
      }
      status{
        id
        title
      }
      options{
        id
        title
      } 
      currency{
        id
        title
      }      
    }
`;

const GET_VENDOR = gql`
    query GetVendor($org_id: Int!) {
      vendor(where: {org_id: {_eq: $org_id}}) {
        id
        org_id
        name
        number
        supplier_name
        supplier_number
        site_code
        site_code_original
      }      
    }
`;

const INSERT = gql`
    mutation Invoice($created_by: Int!, $invoice_number: String!, $vendor: Int!, $entity: Int!, $status: Int!, $options: Int!, $currency: Int!, $invoice_amount: String!, $gl_date: String!, $created_email: String!, $description: String, $tax: String!) {
      insert_invoice_one(object: {
        created_by: $created_by, 
        created_email: $created_email, 
        invoice_number: $invoice_number, 
        vendor: $vendor, 
        entity: $entity, 
        status: $status, 
        currency: $currency, 
        option: $options,
        invoice_amount: $invoice_amount,
        gl_date: $gl_date, 
        description: $description,
        tax: $tax
      }) {
        id
        invoice_number
      }
    } 
`;

const INSERT_FILE = gql`
    mutation File($invoice_id: Int!, $created_by: Int!, $invoice_number: String!, $filepath: String!, $filename: String!, $nodeid: String!){
      insert_files_one(object: {invoice_id: $invoice_id, alfresco_url: $filepath, created_by: $created_by, invoice_number: $invoice_number, name: $filename, nodeid: $nodeid}) {
        id
        invoice_number
      }
    }

`;


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const fileTypes = ["PDF"];

export default function Create() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [item, setItem] = React.useState();
  const [item1, setItem1] = React.useState();
  const [item2, setItem2] = React.useState();
  const [item3, setItem3] = React.useState();
  const [progress, setProgress] = React.useState();
  const [speed, setSpeed] = React.useState();
  const [currencyDefault, setCurrencyDefault] = React.useState(1);

  const insertFileArray = useSelector((state) => state.menu.fileUploadList);

  const { loading, data, refetch } = useQuery(GET) || [];
  
  const [getLazyVendor, { loading : vendorLoading, data : vendorData, refetch : vendorRefetch }] = useLazyQuery(GET_VENDOR) || [];

  const [insertInvoice, { data: insertData, error: insertError }] = useMutation(INSERT);
  const [insertFile, { data: insertDataFile, error: insertErrorFile }] = useMutation(INSERT_FILE );
  const [file, setFile] = useState(null);

  const [invid, setInvid] = React.useState();
  const [invnum, setInvnum] = React.useState(1);
  const [desc, setDesc] = React.useState();
  const [tax, setTax] = React.useState('yes');

  const [amount, setAmount] = React.useState();
  const [vendorName, setVendorName] = React.useState();
  const [entityName, setEntityName] = React.useState();
  const [currencyHeader, setCurrencyHeader] = React.useState('OMR');
  const [siteCode, setSiteCode] = React.useState();
  const [glDate, setGlDate] = React.useState();
  const [options, setOptions] = React.useState();
  const [entityOrgId, setEntityOrgId] = React.useState();
  const [vendorNumber, setVendorNumber] = React.useState();
  const [vendorCode, setVendorCode] = React.useState();


  const handleChange = (file) => {
    setFile(file);
    console.log('xxxx', insertData, file)
  };

  const uploadSuccessMessage = (message) => {
    dispatch(
      openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: {
          color: 'primary'
        },
        close: true
      })
    )
  }

  const existMessage = (msg) => {
    dispatch(
      openSnackbar({
        open: true, anchorOrigin: { vertical: 'top', horizontal: 'right' },
        message: msg,
        variant: 'alert',
        alert: {
          color: 'error'
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

  const handleFileUpload = async (formData, iid, filename) => {
   console.log(formData.entries()["file"]);
    dispatch(updateFileUploadList({
      "file_name": filename,
      "progress": 0
    }));
    if (formData) {
      await axiosServices.post(`${API_URL}/invoice/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: data => {
          //Set the progress value to show the progress bar
          console.log(data)
          var filesize = data.total;
          var Mbps = (filesize * 8 / ((1 / Math.pow(10, 3)) * 27)) / Math.pow(10, 6);
          console.log(Mbps);
          const progress = Math.round((100 * data.loaded) / data.total)
          setProgress(progress)
          setSpeed(Mbps);
          dispatch(updateFileUploadList({
            "file_name": filename,
            "progress": progress
          }));
        },
      })
        .then(data => {
          uploadSuccessMessage("File upload completed.");
          return false;
        })
        .catch(error => {
          dispatch(updateFileUploadList({
            "file_name": file.name,
            "progress": 0,
            "error": error
          }));
          existMessage(error);
          console.log('Upload axios catch: ', error)
        })
    }
  }

  const uploadHandler = (param, invoice, iid, amount, vendorName, entityName, currencyHeader, siteCode, glDate, desc, tax) => {

    console.log(glDate)
    console.log(Moment(glDate).format('D-MMM-YY'))

    var formData = new FormData();
    formData.append('file', param);  
    formData.append('invoice', invoice);  
    formData.append('invoice_id', iid);  
    formData.append('amount', amount );
    formData.append('vendor_name', vendorName );
    formData.append('entity_name', entityName );
    formData.append('currency', currencyHeader );
    formData.append('site_id', siteCode );
    formData.append('options', options );
    formData.append('vendor_number', vendorNumber );
    formData.append('entity_org_id', entityOrgId );
    formData.append('vendor_code', vendorCode );
    formData.append('description', desc );
    formData.append('tax', tax );

    
    formData.append('al_param1', localStorage.getItem('al_param1') );
    formData.append('al_param2', localStorage.getItem('al_param2') );
    
    // formData.append('gl_date', Moment(glDate).format('D-MMM-YY') );
    formData.append('gl_date', glDate );
    console.log(formData.entries(), param, invoice, iid);
    handleFileUpload(formData, iid, param.name)
    //navigate('/invoice/list')
  }

  useEffect(() => {
    if (insertData) {      
      setInvid(insertData.insert_invoice_one.id)

      if (file) {
        console.log(file)
        uploadHandler(file, invnum, insertData.insert_invoice_one.id, amount, vendorName, entityName, currencyHeader, siteCode, glDate, desc, tax);
      }
    }
    if(insertError){
      // if(deleteError.graphQLErrors[0].message.includes("Uniqueness violation")){
      if(insertError.graphQLErrors[0].message.includes("Uniqueness violation")){        
        errorMessage("An Invoice with this invoice number + Entity + Vendor combination already exist. ")
      }
      else{
        errorMessage("Some error occured. Check your internet connection or Contact Administrator.") 
      }
    }
  }, [insertData, insertError]);

  const filterVendorOptions = createFilterOptions({
    stringify: (option) => option.supplier_name + option.supplier_number,
  });


  return (
    <MainCard title={<><IconButton color="primary" onClick={() => navigate(-1)} sx={{ p:0, fontSize: "14px"}}>
            <IconChevronLeft />
          </IconButton>Create Invoice</> }>
      <Formik
        initialValues={{
          created_by: localStorage.getItem('user_id'),
          created_email: localStorage.getItem('email'),
          invoice_number: undefined,
          description: undefined,
          vendor: undefined,
          entity: undefined,
          currency: currencyDefault,
          invoice_amount: undefined,
          gl_date: undefined,
          status: 1,
          options: '',
          tax: ''
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values && file) {
            insertInvoice({
              variables: values,
            }).then((resp) => {
              console.log("submited")
              setSubmitting(false);
            }).catch((error) => setSubmitting(false))
          } else {
            if(!file){
              errorMessage("Please Upload File.")
            }  
            setSubmitting(false);
          }
        }}
       //  validate={(values) => {
       //    let errors = {};
       //    if (!values.invoice_number) {
       //      errors.invoice_number = 'Invoice number is required'
       //    }
       //    if (!values.vendor) {
       //      errors.vendor = 'Select a valid vendor'
       //    }
       //    if (!values.entity) {
       //      errors.entity = 'Select a valid entity'
       //    }
       //    if (!values.options) {
       //      errors.options = 'Select a processing option'
       //    }
       //    return errors;
       // }}
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
          <form onSubmit={handleSubmit}  >
            <TextField
              name="invoice_number"
              label="Enter Invoice Number"
              variant="outlined"
              size="small"
              //onChange={handleChange}
              onChange={(event, newValue) => {
                values.invoice_number = event.target.value;
                setInvnum(event.target.value);
              }}
              onBlur={handleBlur}
              value={values.invoice_number}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Enter Description"
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              //onChange={handleChange}
              onChange={(event, newValue) => {
                values.description = event.target.value;
                setDesc(event.target.value);
              }}
              onBlur={handleBlur}
              value={values.description}
              fullWidth
              required
            />
            <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={1}>
              <Grid container spacing={2} alignItems="left">
                <Grid item xs={6} lg={6} >            
                  <Autocomplete
                    disablePortal
                    disableClearable="true"
                    options={data && data.entity}
                    getOptionLabel={(option) => option.title}
                    onChange={(event, newValue) => {
                      values.entity = newValue.id;
                      setEntityName(newValue.title);
                      setEntityOrgId(newValue.org_id);
                      getLazyVendor({
                          variables: {
                            org_id: newValue.org_id
                          }
                        })
                    }}
                    name="entity"
                    size="small"
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>                  
                          {option.title} ({option.org_id})
                        </Box>
                      )}
                    renderInput={(params) => (
                      <TextField
                        sx={{ mt: 2 }}
                        {...params}
                        fullWidth
                        required
                        label="Select Entity"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} lg={6} >
                  {
                    vendorData &&
                    <Autocomplete
                      filterOptions={filterVendorOptions}
                      disablePortal
                      disableClearable="true"
                      options={vendorData && vendorData.vendor}
                      getOptionLabel={(option) => option.supplier_name}
                      onChange={(event, newValue) => {
                        values.vendor = newValue.id;
                        setVendorName(newValue.supplier_name);
                        setSiteCode(newValue.site_code);        
                        setVendorNumber(newValue.supplier_number);
                        setVendorCode(newValue.site_code_original);
                      }}
                      name="vendor"                      
                      size="small"
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>                  
                          {option.supplier_name} ({option.supplier_number})
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          required
                          sx={{ mt: 2 }}
                          {...params}
                          fullWidth
                          label="Select Vendor"
                        />
                      )}
                    />
                  }
                </Grid>
              </Grid>
            </Stack>
            {
              siteCode &&
              <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>               
                <Typography variant="h5">Vendor Number:</Typography>
                <Typography variant="p">
                  {
                      vendorNumber
                  }
                </Typography>
              </Stack>
            }          
            <Select
              name="currency"
              size="small"
              onChange={(event, newValue) => {
                console.log(event.target.value)
                    values.setCurrencyHeader = event.target.title; 
                    values.currency = event.target.value;
                    setCurrencyDefault(event.target.value);
                    // setCurrencyHeader(event.target.value);
                    console.log(event.target.value)
                  }}
              value={currencyDefault}
              fullWidth
              displayEmpty
              required              
              sx={{ mt: 2 }}
            >
              <MenuItem onChange={handleChange} value="">
                - Select Currency -
              </MenuItem>
              {data &&
                data.currency &&
                data.currency.map((item, index) => (
                  <MenuItem                   
                  value={item.id} key={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
            <Stack direction="row" alignItems="flex-start" spacing={1} mb={1} mt={2}>
              <Grid container spacing={2} alignItems="left">
                <Grid item xs={12} lg={12} >   
                  <TextField
                    name="invoice_amount"
                    label="Enter Invoice Amount"
                    variant="outlined"
                    size="small"
                    //onChange={handleChange}
                    onChange={(event, newValue) => {
                      values.invoice_amount = event.target.value;
                      // const taxVal = parseFloat(event.target.value) * (5/100)
                      // values.tax = taxVal.toString();
                      setAmount(event.target.value);
                      // setTax(taxVal);
                    }}
                    onBlur={handleBlur}
                    value={values.invoice_amount}
                    sx={{ mt: 2 }}
                    fullWidth
                    required
                  />
                </Grid>  
              </Grid>  
              <Grid container spacing={2} alignItems="left">
                <Grid item xs={6} lg={6} >   
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Tax Applicable</FormLabel>
                    <RadioGroup row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="yes"
                      name="tax"
                      onChange={(event, newValue) => {
                        setTax(event.target.value);
                        console.log(event.target.value)
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>  
              </Grid>    
            </Stack>
            <InputLabel sx={{ mt: 2, fontSize: '14px' }}>
              GL Date:{' '}
            </InputLabel>
            <TextField
              name="gl_date"
              variant="outlined"
              size="small"
              type="date"              
              onChange={(event, newValue) => {
                values.gl_date = event.target.value;
                const tempDate = Moment(event.target.value).format('D-MMM-YY')
                setGlDate(tempDate);
              }}
              onBlur={handleBlur}
              value={values.gl_date}
              
              fullWidth
              required
            />

            <Select
              name="options"
              size="small"
              onChange={(event, newValue) => {
                    values.options = event.target.value;
                    setOptions(event.target.value);
                    console.log(event.target.value)
                  }}
              value={values.options}
              fullWidth
              displayEmpty
              required              
              sx={{ mt: 2 }}
            >
              <MenuItem onChange={handleChange} value="">
                - Select Processing Option -
              </MenuItem>
              {data &&
                data.options &&
                data.options.map((item, index) => (
                  <MenuItem                   
                  value={item.id} key={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
          
            <Box align="right">
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                disabled={isSubmitting}
                type="submit"
                size="small"
              >
                Create
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <InputLabel sx={{ mb: 1, color: '#222', fontSize: '16px' }}>
        Upload Invoice File:{' '}
      </InputLabel>

      <Box>
        <FileUploader
          multiple={false}
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          maxSize={20}
        />
        <p>{file ? `File name: ${file.name}` : "No invoice file added yet. (Max Size: 20 MB)"}</p>
      </Box>

      {/* {progress && <LinearProgressWithLabel value={progress} />}
      <p>Upload Speed: {speed} mbps</p> */}
    </MainCard>
  );
}
