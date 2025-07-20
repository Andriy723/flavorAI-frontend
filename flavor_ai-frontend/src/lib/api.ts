import axios from 'axios';
import Cookies from 'js-cookie';
import {
    AuthResponse,
    LoginDto,
    RegisterDto,
    Recipe,
    CreateRecipeDto,
    CreateRatingDto,
    User
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterDto): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
};

export const usersApi = {
    getProfile: async (): Promise<User> => {
        const response = await api.get('/users/profile');
        return response.data;
    },
};

export const recipesApi = {
    getAll: async (search?: string): Promise<Recipe[]> => {
        const response = await api.get('/recipes', {
            params: search ? { search } : {}
        });
        return response.data;
    },

    getById: async (id: string): Promise<Recipe> => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    },

    getMyRecipes: async (): Promise<Recipe[]> => {
        const response = await api.get('/recipes/my-recipes');
        return response.data;
    },

    create: async (data: CreateRecipeDto): Promise<Recipe> => {
        const response = await api.post('/recipes', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateRecipeDto>): Promise<Recipe> => {
        const response = await api.patch(`/recipes/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/recipes/${id}`);
    },
};

export const ratingsApi = {
    create: async (data: CreateRatingDto): Promise<any> => {
        const response = await api.post('/ratings', data);
        return response.data;
    },

    getByRecipe: async (recipeId: string): Promise<any[]> => {
        const response = await api.get(`/ratings/recipe/${recipeId}`);
        return response.data;
    },

    getAverageRating: async (recipeId: string): Promise<{ average: number; count: number }> => {
        const response = await api.get(`/ratings/recipe/${recipeId}/average`);
        return response.data;
    },
};