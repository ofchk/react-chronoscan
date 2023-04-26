import React, { useState, useEffect } from 'react';
import './style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';

import { Switch } from 'react-router-dom';
import Layout from './layout';
import Signin from './Signin';
import Dashboard from './Dashboard';
import List from './Invoice/List';
import Create from './Invoice/CreateInvoice';
import Master from './Master';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://192.168.5.130:8080/v1/graphql',
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

function App() {
  const [client] = useState(createApolloClient());
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/login" element={<Signin />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoice" element={<List />} />
            <Route path="/createinvoice" element={<Create />} />
            <Route path="/master" element={<Master />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
