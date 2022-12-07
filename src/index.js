import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import ThemeContextWrapper from './darkMode';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
<CookiesProvider>
	<ThemeContextWrapper>
	  <React.StrictMode>
		<App />
	  </React.StrictMode>
	</ThemeContextWrapper>
</CookiesProvider>,
  document.getElementById('root')
);

reportWebVitals();
