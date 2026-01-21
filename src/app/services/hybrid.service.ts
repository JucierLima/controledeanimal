import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HybridService {
  
  private baseUrl = 'http://localhost:3000/api';
  private storageKey = 'animais';
  
  constructor(private http: HttpClient) {}

  // Adicionar animal (tenta API, senão localStorage)
  addAnimal(animal: any): Observable<any> {
    // Adicionar ID local
    animal.id = Date.now();
    
    return this.http.post(`${this.baseUrl}/animais`, animal).pipe(
      catchError(() => {
        // Se API falhar, salva no localStorage
        console.log('API indisponível, salvando localmente');
        this.saveToLocal(animal);
        return of({ success: true, id: animal.id });
      })
    );
  }

  // Listar animais (tenta API, senão localStorage)
  getAnimais(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/animais`).pipe(
      catchError(() => {
        // Se API falhar, busca do localStorage
        console.log('API indisponível, carregando dados locais');
        const animais = this.getFromLocal();
        return of(animais);
      })
    );
  }

  // Obter animal por ID
  getAnimal(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/animais/${id}`).pipe(
      catchError(() => {
        // Se API falhar, busca do localStorage
        const animais = this.getFromLocal();
        const animal = animais.find(a => a.id == id);
        return of(animal || null);
      })
    );
  }

  // Salvar no localStorage
  private saveToLocal(animal: any) {
    const animais = this.getFromLocal();
    animais.push(animal);
    localStorage.setItem(this.storageKey, JSON.stringify(animais));
  }

  // Buscar do localStorage
  private getFromLocal(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Sincronizar dados locais com API (quando disponível)
  syncData(): Observable<any> {
    const localAnimais = this.getFromLocal();
    
    if (localAnimais.length === 0) {
      return of({ message: 'Nenhum dado para sincronizar' });
    }

    return this.http.post(`${this.baseUrl}/sync`, { animais: localAnimais }).pipe(
      catchError(() => {
        return of({ error: 'Não foi possível sincronizar' });
      })
    );
  }
}