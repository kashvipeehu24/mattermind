import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing/Landing';
import { LoginPage } from './pages/Auth/LoginPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
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
import { api, mapBackendMaterialToItem } from './services/api';

export default function App() {
  const [materials, setMaterials] = useState<MaterialItem[]>(MOCK_MATERIALS);
  const [alerts] = useState<AIAlert[]>(MOCK_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'demo' | 'empty'>('demo');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const loadMaterials = () => {
    setIsLoadingApi(true);

    if (!api.isAuthenticated()) {
      setMaterials(MOCK_MATERIALS);
      setDataSource('demo');
      setApiError('Session not authenticated with backend. Displaying curated baseline dataset.');
      setIsLoadingApi(false);
      return;
    }

    api.getMaterials()
      .then((backendMaterials) => {
        if (backendMaterials && backendMaterials.length > 0) {
          const mapped = backendMaterials.map((bm) => mapBackendMaterialToItem(bm));
          setMaterials(mapped);
          setDataSource('live');
          setApiError(null);
        } else {
          // Backend returned empty array: report empty state with baseline toggle
          setMaterials(MOCK_MATERIALS);
          setDataSource('demo');
          setApiError('Backend database contains 0 material records. Showing baseline reference dataset.');
        }
      })
      .catch((err) => {
        console.warn('API getMaterials notice (using fallback workspace dataset):', err?.message || err);
        setMaterials(MOCK_MATERIALS);
        setDataSource('demo');
        setApiError(err?.message || 'Backend materials endpoint unavailable.');
      })
      .finally(() => {
        setIsLoadingApi(false);
      });
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleAddMaterial = (newMaterial: MaterialItem) => {
    setMaterials((prev) => [newMaterial, ...prev]);
  };

  const unresolvedAlertCount = alerts.filter((a) => a.status !== 'resolved').length;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Marketing */}
        <Route path="/" element={<Landing />} />

        {/* Dedicated Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Dashboard Shell with Layout */}
        <Route
          element={
            <DashboardLayout
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              unresolvedAlertCount={unresolvedAlertCount}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={setSelectedMaterial}
              dataSource={dataSource}
              apiError={apiError}
              onRetrySync={loadMaterials}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardHome
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
                dataSource={dataSource}
                apiError={apiError}
              />
            }
          />
          <Route
            path="/materials"
            element={
              <MaterialCatalog
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
                onAddMaterial={handleAddMaterial}
                dataSource={dataSource}
                apiError={apiError}
                onRetrySync={loadMaterials}
              />
            }
          />
          <Route
            path="/catalog"
            element={
              <MaterialCatalog
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
                onAddMaterial={handleAddMaterial}
                dataSource={dataSource}
                apiError={apiError}
                onRetrySync={loadMaterials}
              />
            }
          />
          <Route
            path="/material/:id"
            element={
              <MaterialCatalog
                materials={materials}
                onSelectMaterial={setSelectedMaterial}
                onAddMaterial={handleAddMaterial}
                dataSource={dataSource}
                apiError={apiError}
                onRetrySync={loadMaterials}
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
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}