import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Relative type definitions
export enum RelativeType {
  HUSBAND = "husband",
  WIFE = "wife",
  SON = "son",
  DAUGHTER = "daughter",
  FATHER = "father",
  MOTHER = "mother"
}

export interface Relative {
  relative_type: string;
  count?: number;
  relative_name?: string;
}

export interface CalculationRequest {
  total_estate: number;
  relatives: Relative[];
}

export interface RelativeShare {
  relative_type: string;
  relative_name: string;
  count: number;
  share_fraction: string;
  share_percentage: number;
  amount: number;
  quranic_reference?: string;
  notes?: string;
}

export interface CalculationResponse {
  total_estate: number;
  currency: string;
  relatives_list: RelativeShare[];
  calculation_steps: string[];
  summary: Record<string, any>;
  status: string;
}

// API calls
export const calculateInheritance = async (
  data: CalculationRequest
): Promise<CalculationResponse> => {
  try {
    const response = await api.post<CalculationResponse>('/calculate', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating inheritance:', error);
    throw error;
  }
};

export const getTestCases = async () => {
  try {
    const response = await api.get('/test-cases');
    return response.data;
  } catch (error) {
    console.error('Error fetching test cases:', error);
    throw error;
  }
};

export const getFatwaSources = async (language: string = 'en') => {
  try {
    const response = await api.get('/fatwa-sources', { params: { language } });
    return response.data;
  } catch (error) {
    console.error('Error fetching fatwa sources:', error);
    throw error;
  }
};

export const getChatbotResponse = async (query: string, context: string = 'inheritance_general') => {
  try {
    const response = await api.post('/chatbot', { query, context });
    return response.data;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
};
