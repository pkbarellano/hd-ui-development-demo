import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import RouterComponent from './hoc/router/RouterComponent';
import AuthContextStore from './context/AuthContext';
import NavContextStore from './context/NavigationContext';

// Only active when built with `npm run build:demo` (REACT_APP_DEMO_MODE=true).
// A normal `npm run build` / `npm start` against a real backend never
// touches this — see src/mocks/mockAdapter.js for what it intercepts.
if (process.env.REACT_APP_DEMO_MODE === 'true') {
  // eslint-disable-next-line global-require
  require('./mocks/mockAdapter').enableDemoMode();
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <AuthContextStore>
    <NavContextStore>
      <RouterComponent />
    </NavContextStore>
  </AuthContextStore>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
