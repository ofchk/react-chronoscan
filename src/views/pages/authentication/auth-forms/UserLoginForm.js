import PropTypes from 'prop-types';
import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

import { useNavigate } from 'react-router-dom';
import axiosServices from "utils/axios"
import { API_URL } from 'config';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';

// ===============================|| JWT LOGIN ||=============================== //

const GET_LDAP_PROFILE = gql`
    query GetProfile($email: String!) {
        profile(where: { email_id: { _eq: $email } }) {
            id
            first_name
            email_id
            auth_id
            last_name
            username
        }
    }
`;

const INSERT = gql`
    mutation Profile($email_id: String!, $created_by: Int!, $first_name: String!, $username: String!){
      insert_profile_one(object: {email_id: $email_id, created_by: $created_by, first_name: $first_name, username: $username}) {
        id        
      }
    }

`;


// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const UserLoginForm = ({ loginProp, ...others }) => {
    const theme = useTheme();

    const { login, ldaplogin } = useAuth();

    const scriptedRef = useScriptRef();
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const [getLDAPProfile, { loading: loadingLDAP, error: errorLDAP, data:dataLDAP }] = useLazyQuery(GET_LDAP_PROFILE);
    const [insertProfile, { data: dataProfile, error: errorProfile }] = useMutation(INSERT);
    
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const [checked, setChecked] = React.useState(true);
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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

    useEffect(() => {
        if(dataLDAP && dataLDAP.profile[0].length === 0){
            insertProfile({
                variables: {
                    email: localStorage.getItem('email'),
                    username: localStorage.getItem('email'),
                    first_name: localStorage.getItem('fname'),
                    created_by: 1,
                }
            })
        }
    }, [dataLDAP]);

    return (
        <Formik
            initialValues={{
                // email: 'info@codedthemes.com',
                // password: '123456',
                email: 'dmstest1@moc.com',
                password: 'tEsT98564TRW',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                // navigate('/dashboard');
                try {                    
                    await ldaplogin(values.email, values.password);    

                    if (scriptedRef.current) {
                        getLDAPProfile({ variables: { email: localStorage.getItem('email') } });                        
                        setStatus({ success: true });
                        setSubmitting(false);
                    }
                } catch (err) {
                    console.error(err);
                    if (scriptedRef.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-login"
                            type="text"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password-login"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="large"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            inputProps={{}}
                            label="Password"
                        />
                        {touched.password && errors.password && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                                Sign In
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

UserLoginForm.propTypes = {
    loginProp: PropTypes.number
};

export default UserLoginForm;
