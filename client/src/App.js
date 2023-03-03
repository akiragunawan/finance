import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bs from './BS/Bs';
import Bep from './BEP/Bep';
import './App.css'
function App() {
  return (
    <BrowserRouter>
    <Sidebar />
    <Routes>
      <Route path="/bs" element={<Bs />} />
      { <Route path="/bep" element={<Bep />} />
      /*<Route path="/contact" element={<Contact />} /> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
