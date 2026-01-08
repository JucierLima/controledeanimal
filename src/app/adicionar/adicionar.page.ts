import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonTextarea, IonButton, IonFooter, IonToast } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
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

  constructor(private db: DatabaseService, private router: Router) {}

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagemPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private async converterImagemParaBlob(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (!this.imagemSelecionada) {
        reject('Nenhuma imagem selecionada');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(new Uint8Array(arrayBuffer));
      };
      reader.onerror = () => reject('Erro ao ler arquivo');
      reader.readAsArrayBuffer(this.imagemSelecionada);
    });
  }

  async salvar() {
    console.log('Dados do animal:', this.animal);
    
    // Validar imagem obrigatória
    if (!this.imagemSelecionada) {
      this.mostrarToast('Selecione uma imagem do animal!');
      return;
    }
    
    // Validar campos obrigatórios
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

    try {
      console.log('Convertendo imagem para BLOB...');
      const imagemBlob = await this.converterImagemParaBlob();
      
      // Adicionar imagem ao objeto animal
      this.animal.imagem = imagemBlob;
      
      console.log('Tentando salvar animal:', this.animal);
      const result = await this.db.adicionarAnimal(this.animal);
      console.log('Animal salvo, resultado:', result);
      
      this.mostrarToast('Animal salvo com sucesso!');
      
      // Limpar formulário
      this.animal = {};
      this.imagemSelecionada = null;
      this.imagemPreview = null;
      
      // Navegar para dashboard
      this.router.navigate(['/dashboard']);
      
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      this.mostrarToast('Erro ao salvar: ' + (error.message || 'Erro desconhecido'));
    }
  }

  private mostrarToast(mensagem: string) {
    console.log('Mostrando toast:', mensagem);
    this.toastMessage = mensagem;
    this.showToast = true;
    
    // Forçar detecção de mudança
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

}
