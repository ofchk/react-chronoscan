import React from 'react';
import './style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import Layout from './layout';
import Signin from './Signin';
import Dashboard from './Dashboard';
import List from './Invoice/List';
import Create from './Invoice/CreateInvoice';
import Vendor from './Master/vendor';
import Entity from './Master/entity';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Signin />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoice" element={<List />} />
          <Route path="/createinvoice" element={<Create />} />
          <Route path="/vendors" element={<Vendor />} />
          <Route path="/entity" element={<Entity />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
