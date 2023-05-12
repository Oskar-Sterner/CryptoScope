import React from 'react'
import ReactDOM from 'react-dom/client'
import CryptoCoins from './CryptoCoins.tsx'
import './scss/main.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CryptoCoins />
  </React.StrictMode>,
)
