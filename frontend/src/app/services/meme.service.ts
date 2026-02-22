import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meme, PaginatedResponse, Comment } from '../models/data.models';

@Injectable({ providedIn: 'root' })
export class MemeService {

  private apiUrl = 'http://localhost:3000/api/memes';

  constructor(private http: HttpClient) {}

  // Recupera tutti Meme
  getMemes(page: number = 1, tag?: string, dateFrom?: string, dateTo?: string, sortBy?: string): Observable<PaginatedResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (tag) params = params.set('tag', tag);
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);
    if (sortBy) params = params.set('sortBy', sortBy);

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  // Recupera Meme+Dettagli
  getMemeById(id: number): Observable<Meme> {
    return this.http.get<Meme>(`${this.apiUrl}/${id}`);
  }

  // Meme del giorno
  getMemeOfTheDay(): Observable<Meme> {
    return this.http.get<Meme>(`${this.apiUrl}/meme-of-the-day`);
  }

  // Upload Meme
  uploadMeme(title: string, image: File, tags: string): Observable<Meme> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('tags', tags);

    return this.http.post<Meme>(this.apiUrl, formData);
  }

  // Vota un Meme 
  vote(memeId: number, value: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${memeId}/votes`, { value });
  }

  // Recupera il voto dell'utente corrente su un meme
  getUserVote(memeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${memeId}/votes/me`);
  }

  // Aggiunge Commento
  addComment(memeId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${memeId}/comments`, { text });
  }

  // Recupera tutti Commenti
  getComments(memeId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${memeId}/comments`);
  }
}