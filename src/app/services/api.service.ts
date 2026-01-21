import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = 'http://localhost:3000/api'; // Altere para sua URL da API
  
  constructor(private http: HttpClient) {}

  // Adicionar animal
  addAnimal(animal: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/animais`, animal);
  }

  // Listar todos os animais
  getAnimais(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/animais`);
  }

  // Obter animal por ID
  getAnimal(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/animais/${id}`);
  }

  // Atualizar animal
  updateAnimal(id: number, animal: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/animais/${id}`, animal);
  }

  // Deletar animal
  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/animais/${id}`);
  }
}