import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CampusProvider } from './context/CampusContext.jsx'
import { ExamBoardProvider } from './context/ExamBoardContext.jsx'
import AIAssistant from './components/chatbot/AIAssistant.jsx'
import OfflineIndicator from './components/OfflineIndicator.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import SessionGuard from './components/SessionGuard.jsx'
import './index.css'

// Auto-update the service worker when a new version ships
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-refresh: the next reload picks up the new bundle
  },
  onOfflineReady() {
    // First visit cached — app is ready offline
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <CampusProvider>
            <AuthProvider>
              <ExamBoardProvider>
                <DataProvider>
                  <App />
                  <AIAssistant />
                  <CommandPalette />
                  <OfflineIndicator />
                  <SessionGuard />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      className: '!bg-white !text-ink-800 !shadow-soft !rounded-xl !border !border-ink-100',
                      success: { iconTheme: { primary: '#1e3aa0', secondary: 'white' } },
                    }}
                  />
                </DataProvider>
              </ExamBoardProvider>
            </AuthProvider>
          </CampusProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
