//Modelli dei dati ricevuti dal backend
export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: User;
}

export interface Vote {
  id: number;
  value: number;
  userId: number;
}

export interface Meme {
  id: number;
  title: string;
  imageUrl: string;
  userId: number;
  createdAt: string;
  author: User;
  tags: Tag[];
  comments?: Comment[];
  votes?: Vote[];
  upvotes?: number;
  downvotes?: number;
  score?: number;
}

export interface PaginatedResponse {
  memes: Meme[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}