import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";

import Login from './components/login';
import SignUp from './components/signUp';
import EditAccount from './components/editAccount';
import Admin from './components/admin';
import Movie from './components/movie';
import Reset from './components/reset';
import SendEmail from './components/sendEmail'

import ProtectedRoute from './components/protectedRoute';

class App extends Component {

  render() {
    let isLoggedIn = false;
    if (sessionStorage.getItem('user')) {
      isLoggedIn = true;
    }

    return(
      <Router>
        <Route path='/' exact component={Login}/>
        <ProtectedRoute path='/movies' component={Movie} auth={isLoggedIn}/>
        <ProtectedRoute path='/account' component={EditAccount} auth={isLoggedIn}/>
        <ProtectedRoute path='/admin' component={Admin} auth={isLoggedIn} />
        <Route path='/signup' component={SignUp} />
        {/* <Route path='/*' component={Login}/> */}
      </Router>
    );
  }
}

export default App;