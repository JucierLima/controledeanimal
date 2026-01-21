import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, of, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  
  private supabase: SupabaseClient;
  private storageKey = 'animais';

  constructor() {
    // Suas credenciais do Supabase
    const supabaseUrl = 'https://vpthpqkkajuawuajffij.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdGhwcWtrYWp1YXd1YWpmZmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDY4MTUsImV4cCI6MjA4NDU4MjgxNX0.phyUC3fG1Ou48yW8L9P1l8t7qsFN7oxhWZbFaO5f3GY';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.initUser();
  }

  // Inicializar usuário anônimo
  private async initUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      // Criar usuário anônimo se não existir
      const deviceId = localStorage.getItem('device_id') || this.generateDeviceId();
      localStorage.setItem('device_id', deviceId);
      
      await this.supabase.auth.signInAnonymously({
        options: {
          data: { device_id: deviceId }
        }
      });
    }
  }

  private generateDeviceId(): string {
    return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Migrar dados do localStorage para Supabase
  async migrarDadosLocais() {
    const dadosLocais = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    
    if (dadosLocais.length > 0) {
      console.log('Migrando dados locais para Supabase:', dadosLocais);
      
      for (const animal of dadosLocais) {
        try {
          await this.supabase.from('animal').insert(animal);
        } catch (error) {
          console.error('Erro ao migrar animal:', error);
        }
      }
      
      // Limpar localStorage após migração
      localStorage.removeItem(this.storageKey);
      console.log('Migração concluída!');
    }
  }

  // Adicionar animal
  addAnimal(animal: any): Observable<any> {
    animal.id = Date.now();
    
    return from(this.supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) await this.initUser();
      
      animal.user_id = user?.id;
      return this.supabase.from('animal').insert(animal);
    })).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        return { success: true, id: animal.id, data: response.data };
      }),
      catchError((error) => {
        console.log('Supabase indisponível, salvando localmente', error);
        this.saveToLocal(animal);
        return of({ success: true, id: animal.id });
      })
    );
  }

  // Listar animais
  getAnimais(): Observable<any[]> {
    return from(this.supabase.from('animal').select('*')).pipe(
      catchError(() => {
        console.log('Supabase indisponível, carregando dados locais');
        const animais = this.getFromLocal();
        return of(animais);
      })
    ).pipe(
      map((response: any) => {
        // Supabase retorna { data: [...], error: null }
        return response?.data || response || [];
      })
    );
  }

  // Obter animal por ID
  getAnimal(id: number): Observable<any> {
    return from(this.supabase.from('animal').select('*').eq('id', id).single()).pipe(
      map((response: any) => {
        return response?.data || response || null;
      }),
      catchError(() => {
        const animais = this.getFromLocal();
        const animal = animais.find(a => a.id == id);
        return of(animal || null);
      })
    );
  }

  // Salvar no localStorage (backup)
  private saveToLocal(animal: any) {
    const animais = this.getFromLocal();
    animais.push(animal);
    localStorage.setItem(this.storageKey, JSON.stringify(animais));
  }

  // Buscar do localStorage
  private getFromLocal(): any[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
}