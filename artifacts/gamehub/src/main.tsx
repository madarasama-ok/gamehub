import { createRoot } from 'react-dom/client';

import { setAuthTokenGetter } from "@workspace/api-client-react";

import App from './App';

import './index.css';

setAuthTokenGetter(() => {
  return localStorage.getItem("admin_key");
});

createRoot(document.getElementById('root')!).render(<App />);
