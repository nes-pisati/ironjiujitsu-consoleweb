import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Dashboard from './pages/Dashboard';
import AthletesList from './pages/Athletes';
import AddAthlete from './pages/AddAthlete';
import Layout from './components/Layout';
import { AthleteProvider } from './context/AthleteContext';
import AthleteProfile from './pages/AthleteProfile';
import Subscriptions from './pages/Subscriptions';
import { SubscriptionProvider } from './context/SubscriptionsContext';

function App() {
  return (
    <>
      <AthleteProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout><Dashboard /></Layout>} />
              <Route path='/athletes' element={<Layout><AthletesList /></Layout>} />
              <Route path='/athlete/add' element={<Layout><AddAthlete /></Layout>} />
              <Route path='/athlete/edit/:id' element={<Layout><AddAthlete /></Layout>} />
              <Route path='/athlete/:id' element={<Layout><AthleteProfile /></Layout>} />
              <Route path='/subscriptions' element={<Layout><Subscriptions /></Layout>} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </AthleteProvider>
    </>
  )
}

export default App
