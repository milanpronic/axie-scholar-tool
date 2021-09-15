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

function App() {
  const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }, []);
  return (
      <Router history={history}>
          <Switch>
              <PrivateRoute exact path="/" component={AxiePage} />
              <PrivateRoute exact path="/admin" component={AdminPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Redirect from="*" to="/" />
          </Switch>
      </Router>
  );
}

export default App;
