/**
 * MatterMind API Service Client
 * Handles HTTP requests to the FastAPI backend service.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('mattermind_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
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

export const api = {
  // Health check
  health: () => request<{ status: string }>('/health'),

  // Materials API
  getMaterials: () => request<any[]>('/materials/'),
  getMaterial: (id: number | string) => request<any>(`/materials/${id}`),
  getMaterialHistory: (id: number | string) => request<any[]>(`/materials/${id}/history`),
  getMaterialPassport: (id: number | string) => request<any>(`/materials/${id}/passport`),
  createMaterial: (data: any) =>
    request<any>('/materials/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // AI API
  analyzeMaterial: (materialId: number | string) =>
    request<any>(`/ai/analyze/${materialId}`, {
      method: 'POST',
    }),
  getAIHistory: (materialId: number | string) =>
    request<any[]>(`/ai/history/${materialId}`),

  // Analytics API
  getMaterialAnalytics: () => request<any>('/analytics/materials'),
  getHealthAnalytics: () => request<any>('/analytics/health'),
  getCarbonAnalytics: () => request<any>('/analytics/carbon'),
  getSustainabilityAnalytics: () => request<any>('/analytics/sustainability'),

  // Dashboard API
  getDashboardSummary: () => request<any>('/dashboard/summary'),

  // Auth API
  login: (email: string, password: string) =>
    request<{ access_token: string; refresh_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (userData: any) =>
    request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getCurrentUser: () => request<any>('/auth/me'),
};
