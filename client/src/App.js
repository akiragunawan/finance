import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bs from './BS/Bs'
import './App.css'
function App() {
  return (
    <BrowserRouter>
    <Sidebar />
    <Routes>
      <Route path="/bs" element={<Bs />} />
      {/* <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} /> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
