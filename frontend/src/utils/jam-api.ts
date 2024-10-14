import axios from 'axios';

export interface ICompany {
    id: number;
    company_name: string;
    liked: boolean;
}

export interface ICollection {
    id: string;
    collection_name: string;
    companies: ICompany[];
    total: number;
}

export interface ICompanyBatchResponse {
    companies: ICompany[];
}

const BASE_URL = 'http://localhost:8000';

export async function getCompanies(offset?: number, limit?: number): Promise<ICompanyBatchResponse> {
    try {
        const response = await axios.get(`${BASE_URL}/companies`, {
            params: {
                offset,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function getCollectionsById(id: string, offset?: number, limit?: number): Promise<ICollection> {
    try {
        const response = await axios.get(`${BASE_URL}/collections/${id}`, {
            params: {
                offset,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function getCollectionsMetadata(): Promise<ICollection[]> {
    try {
        const response = await axios.get(`${BASE_URL}/collections`);
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function addIndividualCompanyToLikedCompanies(requestParams?: number[]): Promise<ICollection[]> {
    try {
        const response = await axios.post(`${BASE_URL}/collections/add_individual_company_to_liked_companies/`, requestParams);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error message:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('An unexpected error occurred');
        }
      }
}

export async function addIndividualCompanyToMyList(requestParams?: number[]): Promise<ICollection[]> {
    try {
        const response = await axios.post(`${BASE_URL}/collections/add_individual_company_to_my_list/`, requestParams);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error message:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('An unexpected error occurred');
        }
      }
}

export async function addAllToMyList(): Promise<ICollection[]> {
    try {
        const response = await axios.post(`${BASE_URL}/collections/add_all_to_my_list/`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error message:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('An unexpected error occurred');
        }
      }
}

export async function addAllToLikedCompanies(): Promise<ICollection[]> {
    try {
        const response = await axios.post(`${BASE_URL}/collections/add_all_to_liked_companies`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error message:', error.message);
          throw new Error(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new Error('An unexpected error occurred');
        }
      }
}