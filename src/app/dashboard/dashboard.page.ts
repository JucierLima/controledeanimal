import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HybridService } from '../services/hybrid.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, RouterModule, IonButton]
})
export class DashboardPage {

  animais: any[] = [];

  constructor(private hybrid: HybridService) {}

  ionViewWillEnter() {
    console.log('Entrou no Dashboard');
    this.carregarAnimais();
  }

  carregarAnimais() {
    this.hybrid.getAnimais().subscribe({
      next: (animais) => {
        this.animais = animais;
        console.log('Animais carregados:', this.animais);
      },
      error: (error) => {
        console.error('Erro ao carregar animais:', error);
        this.animais = [];
      }
    });
  }

}
