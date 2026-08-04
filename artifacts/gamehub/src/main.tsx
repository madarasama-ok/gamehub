import { createRoot } from 'react-dom/client';

import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

import App from './App';

import './index.css';

setBaseUrl("http://15.228.45.98");

setAuthTokenGetter(() => {
  return localStorage.getItem("admin_key");
});

createRoot(document.getElementById('root')!).render(<App />);
