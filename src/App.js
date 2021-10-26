import logo from './logo.svg';
import './App.css';
import {
  Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { history } from './_helpers';
import { alertActions } from './_actions';
import { PrivateRoute } from './_components';
import { AxiePage, AdminPage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import 'react-notifications/lib/notifications.css';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
      history.listen((location, action) => {
          // clear alert on location change
          dispatch(alertActions.clear());
      });
  }, []);
  useEffect(() => {
    if(alert.type == "alert-success") {
      toast.success(alert.message);
    } else if(alert.type == "alert-danger") {
      toast.error(alert.message);
    }
  }, [alert])
  
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Router history={history}>
          <Switch>
              <PrivateRoute exact path="/" component={AxiePage} />
              <PrivateRoute exact path="/admin" component={AdminPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
          </Switch>
      </Router>
    </>
  );
}

export default App;
