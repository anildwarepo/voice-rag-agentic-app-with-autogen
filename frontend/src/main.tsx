import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';

createRoot(document.getElementById('root')!).render(
    <FluentProvider theme={webDarkTheme}>    
    <App/>
  </FluentProvider>
)
