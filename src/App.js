// routing
import React, { useState } from 'react';

import Routes from 'routes';
import { HASURA_URL } from 'config';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';

import ThemeCustomization from 'themes';

// auth provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

import { ApolloClient,ApolloProvider,InMemoryCache,HttpLink } from '@apollo/client';
import FileUploadProgress from 'ui-component/file-upload-progress/file-upload-progress';

const createApolloClient = () => {
    return new ApolloClient({
        link: new HttpLink({
          uri: `${HASURA_URL}`,
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


const App = () => {
    const [client] = useState(createApolloClient());

    return <ThemeCustomization>
        {/* <RTLLayout> */}
        <Locales>
            <NavigationScroll>
                <ApolloProvider client={client}>
                    <AuthProvider>
                        <>
                            <Routes />
                            <Snackbar />
                        </>
                    </AuthProvider>
                </ApolloProvider>                
            </NavigationScroll>
        </Locales>
        {/* </RTLLayout> */}
        <FileUploadProgress></FileUploadProgress>
    </ThemeCustomization>
};

export default App;
