import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing/Landing';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { MaterialCatalog } from './pages/dashboard/MaterialCatalog';
import { PredictiveAnalytics } from './pages/dashboard/PredictiveAnalytics';
import { CompatibilityMatrix } from './pages/dashboard/CompatibilityMatrix';
import { BlockchainProvenance } from './pages/dashboard/BlockchainProvenance';
import { SustainabilityESG } from './pages/dashboard/SustainabilityESG';
import { AIAlertsPage } from './pages/dashboard/AIAlertsPage';
import { MOCK_MATERIALS, MOCK_ALERTS } from './data/mockData';
import { MaterialItem, AIAlert } from './types';

export default function App() {
  const [materials] = useState<MaterialItem[]>(MOCK_MATERIALS);
  const [alerts] = useState<AIAlert[]>(MOCK_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

  const unresolvedAlertCount = alerts.filter((a) => a.status !== 'resolved').length;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Shell with Layout */}
        <Route
          element={
            <DashboardLayout
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              unresolvedAlertCount={unresolvedAlertCount}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={setSelectedMaterial}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardHome
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
              />
            }
          />
          <Route
            path="/materials"
            element={
              <MaterialCatalog
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
              />
            }
          />
          <Route
            path="/material/:id"
            element={
              <MaterialCatalog
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
              />
            }
          />
          <Route
            path="/predictive"
            element={
              <PredictiveAnalytics
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <PredictiveAnalytics
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
              />
            }
          />
          <Route
            path="/compatibility"
            element={<CompatibilityMatrix materials={materials} />}
          />
          <Route
            path="/blockchain"
            element={<BlockchainProvenance materials={materials} />}
          />
          <Route
            path="/provenance"
            element={<BlockchainProvenance materials={materials} />}
          />
          <Route
            path="/sustainability"
            element={<SustainabilityESG materials={materials} />}
          />
          <Route path="/alerts" element={<AIAlertsPage />} />
          <Route
            path="/settings"
            element={
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Platform Settings</h2>
                <p className="text-sm text-slate-600">Enterprise Node Configuration & API Preferences.</p>
              </div>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}