import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
// Always start at the top so pinned sections measure from a clean state.
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
