import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx';
import ErrorBoundary from './utils/ErrorBoundary.jsx';
import { AnnouncementProvider } from './context/AnnouncementContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnnouncementProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </AnnouncementProvider>
  </StrictMode>
)
