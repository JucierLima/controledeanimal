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
    console.log('ID recebido na página de detalhes:', id);
    
    if (id) {
      this.supabase.getAnimal(parseInt(id)).subscribe({
        next: (animal) => {
          console.log('Animal carregado na página de detalhes:', animal);
          this.animal = animal || {};
        },
        error: (error) => {
          console.error('Erro ao carregar animal:', error);
          this.animal = {};
        }
      });
    }
  }

}
