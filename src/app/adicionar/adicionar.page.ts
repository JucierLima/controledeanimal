import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonTextarea, IonButton, IonFooter, IonToast } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonTextarea, IonButton, IonFooter, IonToast]
})
export class AdicionarPage {

  animal: any = {};
  showToast = false;
  toastMessage = '';
  imagemSelecionada: File | null = null;
  imagemPreview: string | null = null;

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagemPreview = e.target?.result as string;
        this.animal.imagem = this.imagemPreview; // Salvar como base64
      };
      reader.readAsDataURL(file);
    }
  }

  salvar() {
    console.log('Salvando animal:', this.animal);
    this.storage.add(this.animal);
    this.router.navigate(['/dashboard']);
  }

  private mostrarToast(mensagem: string) {
    this.toastMessage = mensagem;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }

}
