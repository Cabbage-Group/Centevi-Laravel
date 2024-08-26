require('./bootstrap');
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Sidebar from './components/partials/Sidebar.js';
import Navbar from './components/partials/Navbar.js';
import RoutesApp from './routes/RoutesApp.js';

function AppRouter() {
  return (
    <Provider store={store}>
      <RoutesApp />
      {/* <Router>
        <Routes>
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/navbar" element={<Navbar />} />
          <RoutesApp />
        </Routes>
      </Router> */}
    </Provider>
  );
}

const ProtectedRoute = ({ element: Component, isAuthenticated, ...rest }) => {
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};


ReactDOM.render(<AppRouter />, document.getElementById('app'));


