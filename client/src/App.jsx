import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar.jsx'

import { Footer } from './components/navbar.jsx'
import Landing from './components/landing.jsx'

function App() {
 


  



  return (
    <>
      
      <header>
        <div className='w-full h-full'>
          <Navbar />
        </div>
      </header>
      <main>
        <Landing />
      </main>
      <Footer />
   
    </>
  )
}

export default App
