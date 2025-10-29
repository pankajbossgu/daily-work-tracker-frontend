// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main component

// Use the new React 18 createRoot API to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
