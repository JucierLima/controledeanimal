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

  constructor(private db: DatabaseService, private router: Router) {}

  async salvar() {
    if (!this.animal.raca || !this.animal.cor || !this.animal.tamanho || !this.animal.peso || !this.animal.descricao) {
      this.toastMessage = 'Preencha todos os campos obrigatórios!';
      this.showToast = true;
      return;
    }

    try {
      await this.db.adicionarAnimal(this.animal);
      this.toastMessage = 'Animal salvo com sucesso!';
      this.showToast = true;
      this.animal = {};
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error) {
      this.toastMessage = 'Erro ao salvar animal!';
      this.showToast = true;
    }
  }

}
