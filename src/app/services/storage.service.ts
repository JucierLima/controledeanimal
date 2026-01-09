import { Injectable } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class StorageService {

  private KEY = 'animais';

  getAll() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  add(animal: any) {
    const animais = this.getAll();
    animais.push({
      ...animal,
      id: Date.now()
    });
    localStorage.setItem(this.KEY, JSON.stringify(animais));
  }

  getById(id: number) {
    const animais = this.getAll();
    return animais.find((a: any) => a.id == id);
  }
}