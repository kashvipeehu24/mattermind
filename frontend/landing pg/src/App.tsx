import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing/Landing';
import DashboardHome from './pages/dashboard/DashboardHome';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}