import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.page.html',
  styleUrls: ['./detalhe.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton]
})
export class DetalhePage implements OnInit {

  animal: any = {};

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Buscando animal ID:', id, 'APENAS no Supabase');
    
    if (id) {
      this.supabase.getAnimal(parseInt(id)).subscribe({
        next: (animal) => {
          console.log('Animal carregado do Supabase:', animal);
          this.animal = animal || {};
        },
        error: (error) => {
          console.error('ERRO: Falha ao carregar animal do Supabase:', error);
          this.animal = {};
        }
      });
    }
  }

}
