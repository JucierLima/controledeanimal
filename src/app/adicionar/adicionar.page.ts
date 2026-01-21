import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonTextarea, IonButton, IonFooter, IonToast } from '@ionic/angular/standalone';
import { HybridService } from '../services/hybrid.service';
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
  fotoPaiPreview: string | null = null;
  fotoMaePreview: string | null = null;

  constructor(
    private hybrid: HybridService,
    private router: Router
  ) {}

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagemPreview = e.target?.result as string;
        this.animal.imagem = this.imagemPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  onFotoPaiSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoPaiPreview = e.target?.result as string;
        this.animal.foto_pai = this.fotoPaiPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  onFotoMaeSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoMaePreview = e.target?.result as string;
        this.animal.foto_mae = this.fotoMaePreview;
      };
      reader.readAsDataURL(file);
    }
  }

  salvar() {
    // Validar campos obrigatórios
    if (!this.animal.origem?.trim()) {
      this.mostrarToast('Campo "Origem" é obrigatório!');
      return;
    }
    if (!this.animal.data_nascimento?.trim()) {
      this.mostrarToast('Campo "Data nascimento/vinda" é obrigatório!');
      return;
    }
    if (!this.animal.raca?.trim()) {
      this.mostrarToast('Campo "Raça" é obrigatório!');
      return;
    }
    if (!this.animal.cor?.trim()) {
      this.mostrarToast('Campo "Cor" é obrigatório!');
      return;
    }
    if (!this.animal.tamanho?.trim()) {
      this.mostrarToast('Campo "Tamanho" é obrigatório!');
      return;
    }
    if (!this.animal.peso?.trim()) {
      this.mostrarToast('Campo "Peso" é obrigatório!');
      return;
    }
    if (!this.animal.descricao?.trim()) {
      this.mostrarToast('Campo "Descrição" é obrigatório!');
      return;
    }

    console.log('Salvando animal:', this.animal);
    
    this.hybrid.addAnimal(this.animal).subscribe({
      next: (response) => {
        console.log('Animal salvo:', response);
        this.mostrarToast('Animal salvo com sucesso!');
        this.animal = {};
        this.imagemPreview = null;
        this.fotoPaiPreview = null;
        this.fotoMaePreview = null;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Erro ao salvar:', error);
        this.mostrarToast('Erro ao salvar animal!');
      }
    });
  }

  private mostrarToast(mensagem: string) {
    this.toastMessage = mensagem;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }

}
