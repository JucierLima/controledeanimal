import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://vpthpqkkajuawuajffij.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdGhwcWtrYWp1YXd1YWpmZmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDY4MTUsImV4cCI6MjA4NDU4MjgxNX0.phyUC3fG1Ou48yW8L9P1l8t7qsFN7oxhWZbFaO5f3GY';
    
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });
  }

  // ADICIONAR ANIMAL - APENAS SUPABASE
  addAnimal(animal: any): Observable<any> {
    // Gerar ID único baseado em timestamp
    animal.id = Date.now();
    animal.created_at = new Date().toISOString();
    
    console.log('Salvando animal no Supabase:', animal);
    
    return from(this.supabase.from('animal').insert(animal)).pipe(
      map((response: any) => {
        if (response.error) {
          console.error('Erro do Supabase:', response.error);
          throw response.error;
        }
        console.log('Animal salvo com sucesso no Supabase');
        return { success: true, id: animal.id };
      }),
      catchError((error) => {
        console.error('Falha ao salvar no Supabase:', error);
        return throwError(() => error);
      })
    );
  }

  // LISTAR ANIMAIS - APENAS SUPABASE (DADOS GLOBAIS)
  getAnimais(): Observable<any[]> {
    console.log('Buscando TODOS os animais do Supabase...');
    
    return from(this.supabase.from('animal').select('*').order('created_at', { ascending: false })).pipe(
      map((response: any) => {
        if (response.error) {
          console.error('Erro ao buscar animais:', response.error);
          throw response.error;
        }
        
        console.log(`${response.data.length} animais encontrados no Supabase`);
        return response.data || [];
      }),
      catchError((error) => {
        console.error('Falha ao buscar animais do Supabase:', error);
        return throwError(() => error);
      })
    );
  }

  // BUSCAR ANIMAL POR ID - APENAS SUPABASE
  getAnimal(id: number): Observable<any> {
    console.log('Buscando animal ID:', id, 'no Supabase');
    
    return from(this.supabase.from('animal').select('*').eq('id', id)).pipe(
      map((response: any) => {
        if (response.error) {
          console.error('Erro ao buscar animal:', response.error);
          throw response.error;
        }
        
        console.log('Animal encontrado no Supabase:', response.data);
        return response.data?.[0] || null;
      }),
      catchError((error) => {
        console.error('Falha ao buscar animal do Supabase:', error);
        return throwError(() => error);
      })
    );
  }

  // ATUALIZAR ANIMAL - APENAS SUPABASE
  updateAnimal(id: number, animal: any): Observable<any> {
    console.log('Atualizando animal ID:', id, 'no Supabase');
    
    return from(this.supabase.from('animal').update(animal).eq('id', id)).pipe(
      map((response: any) => {
        if (response.error) {
          console.error('Erro ao atualizar animal:', response.error);
          throw response.error;
        }
        
        console.log('Animal atualizado no Supabase');
        return { success: true };
      }),
      catchError((error) => {
        console.error('Falha ao atualizar animal no Supabase:', error);
        return throwError(() => error);
      })
    );
  }

  // DELETAR ANIMAL - APENAS SUPABASE
  deleteAnimal(id: number): Observable<any> {
    console.log('Deletando animal ID:', id, 'do Supabase');
    
    return from(this.supabase.from('animal').delete().eq('id', id)).pipe(
      map((response: any) => {
        if (response.error) {
          console.error('Erro ao deletar animal:', response.error);
          throw response.error;
        }
        
        console.log('Animal deletado do Supabase');
        return { success: true };
      }),
      catchError((error) => {
        console.error('Falha ao deletar animal do Supabase:', error);
        return throwError(() => error);
      })
    );
  }
}