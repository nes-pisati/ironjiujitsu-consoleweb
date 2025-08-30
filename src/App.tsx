import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Dashboard from './pages/Dashboard';
import AthletesList from './pages/Athletes';
import AddAthlete from './pages/AddAthlete';
import Layout from './components/Layout';
import { AthleteProvider } from './context/AthleteContext';

function App() {
  return (
    <>
      <AthleteProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout><Dashboard /></Layout>} />
            <Route path='/athletes' element={<Layout><AthletesList /></Layout>} />
            <Route path='/add-athlete' element={<Layout><AddAthlete /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AthleteProvider>
    </>
  )
}

export default App
