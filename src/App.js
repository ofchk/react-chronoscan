import React from 'react';
import './style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import Signin from './Signin';
import Dashboard from './Dashboard';
import List from './Invoice/List';
import Create from './Invoice/CreateInvoice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice" element={<List />} />
        <Route path="/createinvoice" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
