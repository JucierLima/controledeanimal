import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, RouterModule, IonButton, IonButtons, IonIcon]
})
export class DashboardPage implements OnInit {

  animais: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    console.log('Dashboard inicializado - dados virão APENAS do Supabase');
  }

  ionViewWillEnter() {
    console.log('Entrou no Dashboard');
    this.carregarAnimais();
  }

  carregarAnimais() {
    console.log('Carregando animais do Supabase...');
    this.supabase.getAnimais().subscribe({
      next: (animais) => {
        console.log(`${animais.length} animais carregados do Supabase`);
        this.animais = animais;
      },
      error: (error) => {
        console.error('ERRO: Falha ao carregar animais do Supabase:', error);
        this.animais = [];
      }
    });
  }

  excluirAnimal(id: number) {
    if (confirm('Tem certeza que deseja excluir este animal?')) {
      this.supabase.deleteAnimal(id).subscribe({
        next: () => {
          console.log('Animal excluído com sucesso');
          this.carregarAnimais();
        },
        error: (error) => {
          console.error('Erro ao excluir animal:', error);
        }
      });
    }
  }

}
