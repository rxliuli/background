import ReactDOM from 'react-dom/client'
import { App } from './App'
import './style.css'
import { ShadowProvider } from '@/integrations/shadow/ShadowProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/integrations/theme/ThemeProvider'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <ShadowProvider container={document.body}>
    <ThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </ShadowProvider>,
)
