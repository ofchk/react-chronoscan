import React from 'react';
import './style.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Signin from './Signin';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="wrapper">
      <h1>Welcome to Muscat Overseas</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Signin />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
