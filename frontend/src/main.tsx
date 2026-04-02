import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from './router/router.tsx'
import { ThemeContext } from './shared/context/ThemeContext.tsx'
import type { Theme } from './shared/stores/theme.store.ts'

function Root() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  })

  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }
  return (
    <>
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <Router/>
    </ThemeContext.Provider>
    
    </>
  )
}

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  
  <QueryClientProvider client={queryClient}>
  <StrictMode>
   <Root/>
  </StrictMode>
  </QueryClientProvider>

)
