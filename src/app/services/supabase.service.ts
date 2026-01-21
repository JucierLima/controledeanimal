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
    const supabaseUrl = 'https://vpthpqkkajuawuajffij.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdGhwcWtrYWp1YXd1YWpmZmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDY4MTUsImV4cCI6MjA4NDU4MjgxNX0.phyUC3fG1Ou48yW8L9P1l8t7qsFN7oxhWZbFaO5f3GY';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private generateDeviceId(): string {
    return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addAnimal(animal: any): Observable<any> {
    animal.id = Date.now();
    animal.device_id = this.getDeviceId();
    
    console.log('Salvando animal:', animal);
    
    // Sempre salvar localmente primeiro
    this.saveToLocal(animal);
    
    // Tentar salvar no Supabase
    return from(this.supabase.from('animal').insert(animal)).pipe(
      map((response: any) => {
        console.log('Salvo no Supabase:', response);
        return { success: true, id: animal.id };
      }),
      catchError((error) => {
        console.log('Erro no Supabase, mantendo dados locais:', error);
        return of({ success: true, id: animal.id, local: true });
      })
    );
  }

  getAnimais(): Observable<any[]> {
    console.log('Buscando todos os animais...');
    
    const deviceId = this.getDeviceId();
    const animaisLocais = this.getFromLocal();
    
    return from(this.supabase.from('animal').select('*').eq('device_id', deviceId)).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        
        const animaisSupabase = response.data || [];
        console.log('Dados do Supabase:', animaisSupabase);
        console.log('Dados locais:', animaisLocais);
        
        // Combinar dados: Supabase + localStorage (sem duplicatas)
        const todosAnimais = [...animaisSupabase];
        
        animaisLocais.forEach(animalLocal => {
          const jaExiste = todosAnimais.find(a => a.id === animalLocal.id);
          if (!jaExiste) {
            todosAnimais.push(animalLocal);
          }
        });
        
        console.log('Total de animais combinados:', todosAnimais);
        return todosAnimais;
      }),
      catchError((error) => {
        console.log('Erro no Supabase, usando apenas dados locais:', error);
        return of(animaisLocais);
      })
    );
  }

  getAnimal(id: number): Observable<any> {
    console.log('Buscando animal com ID:', id);
    
    const animaisLocais = this.getFromLocal();
    const animalLocal = animaisLocais.find(a => a.id == id);
    
    return from(this.supabase.from('animal').select('*').eq('id', id).single()).pipe(
      map((response: any) => {
        if (response.error) {
          throw response.error;
        }
        console.log('Animal encontrado no Supabase:', response.data);
        return response.data;
      }),
      catchError((error) => {
        console.log('Erro no Supabase, buscando localmente:', error);
        console.log('Animal local encontrado:', animalLocal);
        return of(animalLocal || null);
      })
    );
  }

  private saveToLocal(animal: any) {
    const animais = this.getFromLocal();
    // Remover animal existente com mesmo ID
    const index = animais.findIndex(a => a.id === animal.id);
    if (index >= 0) {
      animais[index] = animal;
    } else {
      animais.push(animal);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(animais));
    console.log('Salvo localmente:', animal);
  }

  private getFromLocal(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async migrarDadosLocais() {
    // Método mantido para compatibilidade
    console.log('Migração não necessária nesta versão');
  }
}