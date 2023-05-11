import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

import { gql, useQuery, useLazyQuery } from '@apollo/client';

const GET_PROFILE = gql`
    query GetProfile($id: Int!) {
        profile(where: { auth_id: { _eq: $id } }) {
            id
            first_name
            email_id
            auth_id
            last_name
            username
        }
    }
`;

const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const [getProfile, { loading, error, data }] = useLazyQuery(GET_PROFILE);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                const serviceId = window.localStorage.getItem('id');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    // const response = await axios.get('/api/account/me');
                    const response = await getProfile({ variables: { id: serviceId } });
                    const user = response.data.profile[0];
                    window.localStorage.setItem('fname', user.first_name);
                    window.localStorage.setItem('lname', user.last_name);
                    console.log(user)
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };
        init();
    }, [localStorage.getItem('serviceToken')]);

    const login = async (username, password) => {
        const response = await axios.post('http://192.168.5.130:3010/api/auth/signin', { username, password });
        const { token, user } = response.data;
        setSession(token);
        localStorage.setItem('serviceToken', token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);
        localStorage.setItem('roles', user.roles);
        localStorage.setItem('id', user.id);
        localStorage.setItem('role', user.user_role);
        localStorage.setItem('uid', user.id);
        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };  

    const ldaplogin = async (username, password) => {
        const response = await axios.post('http://192.168.5.130:3010/user/login', {
                            email: username,
                            password: password
                        });
        const user = {
            email: response.data.email,
            first_name: response.data.name,
            last_name: '',
            username: response.data.email
        };

        localStorage.setItem('username', response.data.email);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('roles', 'user');
        localStorage.setItem('role', 'user');

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };      

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
        localStorage.clear();
        console.log(localStorage)
        window.location.reload(false);
    };


    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, ldaplogin, logout }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
