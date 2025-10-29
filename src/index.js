import React from 'react';
import ReactDOM from 'react-dom/client';
// MANDATORY: This line imports the necessary Bootstrap CSS styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
