/**
 * MatterMind API Service Client
 * Handles HTTP requests to the FastAPI backend service with authentication token handling.
 */

import { MaterialItem, AlertSeverity, PassportStatus } from '../types';

const envApiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL !== undefined)
  ? import.meta.env.VITE_API_URL
  : (typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined);

export const API_BASE_URL = (
  envApiUrl !== undefined
    ? envApiUrl
    : (typeof window === 'undefined' || (typeof import.meta !== 'undefined' && import.meta.env?.DEV)
        ? 'http://localhost:8000'
        : '')
).replace(/\/$/, '');

export class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Backend Schemas Matching FastAPI Pydantic Models
export interface BackendUser {
  id: number;
  email: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface BackendMaterial {
  id: number;
  material_name: string;
  material_type: string;
  manufacturer?: string;
  density?: number;
  health_score?: number;
  carbon_score?: number;
  status?: string;
  category?: string;
  tags?: string;
  location?: string;
  is_recyclable?: boolean;
  created_at?: string;
}

export interface BackendMaterialCreate {
  material_name: string;
  material_type: string;
  manufacturer?: string;
  density?: number;
  health_score?: number;
  carbon_score?: number;
  status?: string;
  category?: string;
  tags?: string;
  location?: string;
  is_recyclable?: boolean;
}

export interface BackendMaterialPassport {
  passport_id: string;
  material_id: number;
  material_name: string;
  material_type: string;
  manufacturer?: string;
  health_score?: number;
  carbon_score?: number;
  is_recyclable: boolean;
  status: string;
  created_at?: string;
  blockchain_hash?: string;
  provenance_details: {
    category?: string;
    density?: number;
    location?: string;
    tags?: string;
    verification_standard?: string;
    [key: string]: any;
  };
}

export interface BackendAnalysis {
  id: number;
  material_id: number;
  analysis_type: string;
  prediction: string;
  confidence_score: number;
  recommendation: string;
  explanation: string;
  model_name: string;
  model_version: string;
  created_at?: string;
}

export interface BackendBlockchainRecord {
  id: number;
  material_id: number;
  block_hash: string;
  previous_hash?: string;
  transaction_type: string;
  created_at?: string;
  on_chain_status?: 'confirmed' | 'pending' | 'failed' | 'unavailable';
  is_on_chain?: boolean;
  contract_address?: string;
  block_number?: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Map backend response into UI MaterialItem
export function mapBackendMaterialToItem(
  backend: BackendMaterial,
  passport?: BackendMaterialPassport | null
): MaterialItem {
  const health = backend.health_score ?? 85;
  const carbon = backend.carbon_score ?? 15;
  const density = backend.density ?? 4.5;

  let alertLevel: AlertSeverity = 'optimal';
  if (health < 50) alertLevel = 'critical';
  else if (health < 75) alertLevel = 'warning';
  else if (health >= 90) alertLevel = 'optimal';
  else alertLevel = 'info';

  let passportStatus: PassportStatus = 'in_review';
  if (backend.status === 'Active' || backend.status === 'Certified') {
    passportStatus = 'compliant';
  } else if (backend.status === 'Quarantined') {
    passportStatus = 'non_compliant';
  } else if (backend.status === 'Testing') {
    passportStatus = 'in_review';
  }

  const rul = Math.max(1, Math.round((health / 6.5) * 10) / 10);
  const compatibility = Math.min(99, Math.max(45, Math.round(health * 0.9 + 8)));
  const hash = passport?.blockchain_hash || `0x${Math.abs(backend.id * 88192).toString(16).padStart(40, 'a')}`;

  return {
    id: String(backend.id),
    code: backend.tags || `MAT-${String(backend.id).padStart(4, '0')}`,
    name: backend.material_name,
    category: backend.category || backend.material_type || 'Aerospace Alloy',
    composition: backend.tags ? `${backend.material_name} (${backend.tags})` : `${backend.material_name} standard alloy`,
    healthIndex: health,
    remainingUsefulLifeYears: rul,
    compatibilityScore: compatibility,
    passportStatus,
    passportId: passport?.passport_id || `DPP-EU-2026-${String(backend.id).padStart(5, '0')}`,
    blockchainHash: hash,
    blockchainVerified: Boolean(passport?.blockchain_hash && passport.blockchain_hash.startsWith('0x') && passport.blockchain_hash.length === 66),
    carbonSavingsKg: Math.round(carbon * 120),
    recyclabilityGrade: backend.is_recyclable ? 'A+' : 'C',
    supplier: backend.manufacturer || 'Certified Foundry Node',
    batchNo: `B-${new Date(backend.created_at || Date.now()).getFullYear()}-${String(backend.id).padStart(3, '0')}`,
    location: backend.location || 'Facility Vault 01',
    lastTestedDate: backend.created_at ? new Date(backend.created_at).toISOString().split('T')[0] : '2026-03-15',
    alertLevel,
    status: backend.status || 'Active Spec',
    densityGcm3: density,
    tensileStrengthMpa: Math.round(health * 12 + 400),
    thermalConductivity: Math.round(density * 5.2 * 10) / 10,
    embodiedCarbonKgCo2: carbon,
    notes: `Engineered ${backend.material_type} with certified ISO 14040 lifecycle parameters.`
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = api.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    // Auto-clear invalid token on 401
    if (response.status === 401) {
      api.removeToken();
    }

    throw new APIError(
      response.status,
      errorData?.detail || `HTTP Error ${response.status}`,
      errorData
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

const memoryStore: Record<string, string> = {};

export const api = {
  // Auth Helpers
  getToken: () => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('mattermind_token');
    return memoryStore['mattermind_token'] || null;
  },
  setToken: (token: string, refreshToken?: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mattermind_token', token);
      if (refreshToken) localStorage.setItem('mattermind_refresh_token', refreshToken);
    } else {
      memoryStore['mattermind_token'] = token;
      if (refreshToken) memoryStore['mattermind_refresh_token'] = refreshToken;
    }
  },
  removeToken: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mattermind_token');
      localStorage.removeItem('mattermind_refresh_token');
      localStorage.removeItem('mattermind_user');
      localStorage.removeItem('mattermind_offline_mode');
    } else {
      delete memoryStore['mattermind_token'];
      delete memoryStore['mattermind_refresh_token'];
      delete memoryStore['mattermind_user'];
      delete memoryStore['mattermind_offline_mode'];
    }
  },
  isAuthenticated: () => {
    if (typeof localStorage !== 'undefined') return Boolean(localStorage.getItem('mattermind_token'));
    return Boolean(memoryStore['mattermind_token']);
  },
  isOfflineDemo: () => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('mattermind_offline_mode') === 'true';
    return memoryStore['mattermind_offline_mode'] === 'true';
  },
  setOfflineDemo: (val: boolean) => {
    if (typeof localStorage !== 'undefined') {
      if (val) localStorage.setItem('mattermind_offline_mode', 'true');
      else localStorage.removeItem('mattermind_offline_mode');
    } else {
      if (val) memoryStore['mattermind_offline_mode'] = 'true';
      else delete memoryStore['mattermind_offline_mode'];
    }
  },
  getStoredUser: (): BackendUser | null => {
    try {
      const data = typeof localStorage !== 'undefined'
        ? localStorage.getItem('mattermind_user')
        : memoryStore['mattermind_user'];
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setStoredUser: (user: BackendUser) => {
    const data = JSON.stringify(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mattermind_user', data);
    } else {
      memoryStore['mattermind_user'] = data;
    }
  },

  // Health check
  health: () => request<{ status: string }>('/health'),

  // Auth API
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const res = await request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    api.setToken(res.access_token, res.refresh_token);
    try {
      const user = await api.getCurrentUser();
      api.setStoredUser(user);
    } catch {
      // Continue even if /auth/me fails
    }
    return res;
  },

  register: async (userData: { email: string; password: string; full_name?: string; role?: string }): Promise<BackendUser> => {
    return request<BackendUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: () => request<BackendUser>('/auth/me'),

  logout: async () => {
    const refreshToken = localStorage.getItem('mattermind_refresh_token');
    if (refreshToken) {
      try {
        await request<{ detail: string }>('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch {
        // Silently clear local storage even if backend fails
      }
    }
    api.removeToken();
  },

  // Materials API
  getMaterials: (params?: { skip?: number; limit?: number; category?: string; status?: string; manufacturer?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.append('skip', String(params.skip));
    if (params?.limit !== undefined) searchParams.append('limit', String(params.limit));
    if (params?.category) searchParams.append('category', params.category);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.manufacturer) searchParams.append('manufacturer', params.manufacturer);

    const qs = searchParams.toString();
    return request<BackendMaterial[]>(`/materials/${qs ? `?${qs}` : ''}`);
  },

  getMaterial: (id: number | string) => request<BackendMaterial>(`/materials/${id}`),
  getMaterialHistory: (id: number | string) => request<any[]>(`/materials/${id}/history`),
  getMaterialPassport: (id: number | string) => request<BackendMaterialPassport>(`/materials/${id}/passport`),

  createMaterial: (data: BackendMaterialCreate) =>
    request<BackendMaterial>('/materials/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMaterial: (id: number | string, data: Partial<BackendMaterialCreate>) =>
    request<BackendMaterial>(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMaterial: (id: number | string) =>
    request<void>(`/materials/${id}`, {
      method: 'DELETE',
    }),

  searchMaterials: (query: { material_name?: string; manufacturer?: string; category?: string; status?: string; tags?: string }) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    return request<BackendMaterial[]>(`/materials/search?${params.toString()}`);
  },

  // AI Analysis API
  analyzeMaterial: (materialId: number | string) =>
    request<BackendAnalysis>(`/ai/analyze/${materialId}`, {
      method: 'POST',
    }),

  getAIHistory: (materialId: number | string) =>
    request<BackendAnalysis[]>(`/ai/history/${materialId}`),

  // Analytics API
  getMaterialAnalytics: () => request<any>('/analytics/materials'),
  getHealthAnalytics: () => request<any>('/analytics/health'),
  getCarbonAnalytics: () => request<any>('/analytics/carbon'),
  getSustainabilityAnalytics: () => request<any>('/analytics/sustainability'),

  // Dashboard API
  getDashboardSummary: () => request<any>('/dashboard/summary'),

  // Blockchain Ledger API
  createBlockchainRecord: (materialId: number | string, transactionType: string) =>
    request<BackendBlockchainRecord>(`/blockchain/record/${materialId}?transaction_type=${encodeURIComponent(transactionType)}`, {
      method: 'POST',
    }),

  getBlockchainHistory: (materialId: number | string) =>
    request<BackendBlockchainRecord[]>(`/blockchain/history/${materialId}`),

  // Manufacturers API
  getManufacturers: () => request<any[]>('/manufacturers/'),
};
