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
    // Migrar dados locais na primeira vez
    await this.supabase.migrarDadosLocais();
  }

  ionViewWillEnter() {
    console.log('Entrou no Dashboard');
    this.carregarAnimais();
  }

  carregarAnimais() {
    this.supabase.getAnimais().subscribe({
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
