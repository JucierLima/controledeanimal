import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, RouterModule]
})
export class DashboardPage implements OnInit {

  animais: any[] = [];

  constructor(private db: DatabaseService) { }

  async ngOnInit() {
    await this.carregarAnimais();
  }

  async ionViewWillEnter() {
    await this.carregarAnimais();
  }

  async carregarAnimais() {
    try {
      this.animais = await this.db.listarAnimais();
      console.log('Animais carregados:', this.animais);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      this.animais = [];
    }
  }

}
