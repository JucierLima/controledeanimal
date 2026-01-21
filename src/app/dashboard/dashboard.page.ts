import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, RouterModule, IonButton]
})
export class DashboardPage implements OnInit {

  animais: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    console.log('Dashboard inicializado');
  }

  ionViewWillEnter() {
    console.log('Entrou no Dashboard');
    this.carregarAnimais();
  }

  carregarAnimais() {
    console.log('Carregando animais...');
    this.supabase.getAnimais().subscribe({
      next: (animais) => {
        console.log('Animais recebidos:', animais);
        this.animais = animais || [];
      },
      error: (error) => {
        console.error('Erro ao carregar animais:', error);
        this.animais = [];
      }
    });
  }

}
