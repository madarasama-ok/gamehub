import { createRoot } from 'react-dom/client';

import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

import App from './App';

import './index.css';

setBaseUrl("http://3.142.219.9:3001");

setAuthTokenGetter(() => {
  return localStorage.getItem("admin_key");
});

createRoot(document.getElementById('root')!).render(<App />);
