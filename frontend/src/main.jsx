
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Auth0Provider} from "@auth0/auth0-react"

import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Auth0Provider
    domain="dev-dmzqrke2564r1uu2.us.auth0.com"
    clientId="GzEkaPvaszQExTgb2aCcnK3Y1RgQgXh4"
    authorizationParams={{
      redirect_uri: "http://localhost:5173"
    }}
  >
    <App />
    </Auth0Provider> 
  </BrowserRouter>
    
  
)
