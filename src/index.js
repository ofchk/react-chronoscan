import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import App from 'App';
import { BASE_PATH } from 'config';
import { store } from 'store';
import * as serviceWorker from 'serviceWorker';
import reportWebVitals from 'reportWebVitals';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
} from '@apollo/client';

// import { ConfigProvider } from 'contexts/ConfigContext';

// style + assets
import 'assets/scss/style.scss';

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const createApolloClient = () => {
    return new ApolloClient({
        link: new HttpLink({
          uri: 'https://mov.discourselogic.com/v1/graphql',
          headers: {
            // Authorization: `Bearer ${authToken}`,
            'x-hasura-admin-secret': 'chronoaccesskey001',
          },
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-and-network',
          },
        },
    });
};

const [client] = useState(createApolloClient());
root.render(
    
    <ApolloProvider client={client}  store={store}>
        {/* <ConfigProvider> */}
        <BrowserRouter basename={BASE_PATH}>
            <App />
        </BrowserRouter>
        {/* </ConfigProvider> */}
    </ApolloProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
