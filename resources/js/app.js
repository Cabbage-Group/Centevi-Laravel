require('./bootstrap');
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import {
  Navigate
} from 'react-router-dom';
import RoutesApp from './routes/RoutesApp.js';

function AppRouter() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={esES}>
        <RoutesApp />
      </ConfigProvider>
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


