import { createRoot } from 'react-dom/client';
import { setBaseUrl, setAuthTokenGetter } from '@workspace/api-client-react';

import App from './App';

import './index.css';

if (import.meta.env.PROD) {
  setBaseUrl('https://gamehub-cuc7.onrender.com');
}

setAuthTokenGetter(() => localStorage.getItem('admin_key'));

createRoot(document.getElementById('root')!).render(<App />);
