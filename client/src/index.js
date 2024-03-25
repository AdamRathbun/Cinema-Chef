import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.scss';
import './components/mixins.scss'

const root = document.getElementById('root');

const reactRoot = createRoot(root);

const AppWithFont = () => {
  return (
    <div className='root-content'>
      <App />
    </div>
  );
};

reactRoot.render(
  <React.StrictMode>
    <AppWithFont />
  </React.StrictMode>
);
