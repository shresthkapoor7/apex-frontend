const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://apex-backend-production-1266.up.railway.app';

export interface DocumentListItem {
  id: string;
  file_name: string;
  status: string;
  created_at: string;
  purchase_price?: number;
  noi?: number;
  cap_rate?: number;
  occupancy?: number;
  units?: number;
  year_built?: number;
  property_type?: string;
  location?: string;
}

export interface DocumentMetrics {
  id: string;
  document_id: string;
  purchase_price: number;
  noi: number;
  cap_rate: number;
  occupancy: number;
  units: number;
  year_built: number;
  property_type: string;
  location: string;
  risk_summary: string;
  created_at: string;
}

export interface DocumentDetail {
  id: string;
  file_name: string;
  status: string;
  created_at: string;
  metrics: DocumentMetrics;
}

export interface QuerySource {
  page?: number;
  excerpt?: string;
}

export interface QueryResponse {
  answer: string;
  sources?: QuerySource[];
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  return res.json();
}

export async function getDocuments(): Promise<DocumentListItem[]> {
  return fetchApi<DocumentListItem[]>('/documents');
}

export async function getDocument(id: string): Promise<DocumentDetail> {
  return fetchApi<DocumentDetail>(`/documents/${id}`);
}

export async function uploadDocument(file: File): Promise<DocumentListItem> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Upload failed ${res.status}`);
  }
  return res.json();
}

export async function queryDocument(
  id: string,
  question: string
): Promise<QueryResponse> {
  return fetchApi<QueryResponse>(`/documents/${id}/query`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}

export function getDocumentFileUrl(id: string): string {
  return `/api/documents/${id}/file`;
}
