import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import apiBaseUrl from './utils/apiBaseUrl';
import './index.css';

axios.defaults.baseURL = apiBaseUrl;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
