import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar'; 
import Home from './components/Home'
import Exercise  from './components/Exercise';
import Users from './components/Users'
import Edit from './components/Edit';



function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" >
        <Route path='/' exact component={ Home } />
        <Route path='/edit'  component={ Edit } />
        <Route path='/exercise'  component={ Exercise } />
        <Route path='/users'  component={ Users } />
      </div>
    </Router>
  );
}

export default App;
