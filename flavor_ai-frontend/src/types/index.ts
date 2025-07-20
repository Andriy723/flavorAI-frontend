export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface Recipe {
    id: string;
    title: string;
    ingredients: string;
    instructions: string;
    cookTime: number;
    servings: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
    ratings: Rating[];
}

export interface CreateRecipeDto {
    title: string;
    ingredients: string;
    instructions: string;
    cookTime: number;
    servings: number;
}

export interface Rating {
    id: string;
    value: number;
    userId: string;
    recipeId: string;
    user?: {
        id: string;
        name: string;
    };
}

export interface CreateRatingDto {
    rating: number;
    recipeId: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}