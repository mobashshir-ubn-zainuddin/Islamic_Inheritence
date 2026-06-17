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
  HUSBAND = 'husband',
  WIFE = 'wife',
  SON = 'son',
  DAUGHTER = 'daughter',
  GRANDSON = 'grandson',
  GRANDDAUGHTER = 'granddaughter',
  FATHER = 'father',
  MOTHER = 'mother',
  GRANDFATHER = 'grandfather',
  GRANDMOTHER = 'grandmother',
  PATERNAL_GRANDMOTHER = 'paternal_grandmother',
  MATERNAL_GRANDMOTHER = 'maternal_grandmother',
  FULL_BROTHER = 'full_brother',
  FULL_SISTER = 'full_sister',
  PATERNAL_BROTHER = 'paternal_brother',
  PATERNAL_SISTER = 'paternal_sister',
  MATERNAL_BROTHER = 'maternal_brother',
  MATERNAL_SISTER = 'maternal_sister',
  FULL_NEPHEW = 'full_nephew',
  PATERNAL_NEPHEW = 'paternal_nephew',
  FULL_UNCLE = 'full_uncle',
  PATERNAL_UNCLE = 'paternal_uncle',
  FULL_COUSIN = 'full_cousin',
  PATERNAL_COUSIN = 'paternal_cousin',
  FULL_COUSIN_SON = 'full_cousin_son',
  PATERNAL_COUSIN_SON = 'paternal_cousin_son',
  FULL_COUSIN_GRANDSON = 'full_cousin_grandson',
  PATERNAL_COUSIN_GRANDSON = 'paternal_cousin_grandson',
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
  relative_name: string;
  share_fraction: string;
  share_percentage: number;
  share_amount: number;
}

export interface CalculationResponse {
  results: Record<string, { relatives: RelativeShare[] }>;
  calculation_steps: string[];
  total_distributed: number;
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
