import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonTextarea, IonButton, IonFooter, IonToast, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonTextarea, IonButton, IonFooter, IonToast, IonButtons, IonBackButton]
})
export class EditarPage implements OnInit {

  animal: any = {};
  showToast = false;
  toastMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supabase.getAnimal(parseInt(id)).subscribe({
        next: (animal) => {
          this.animal = animal || {};
        },
        error: (error) => {
          console.error('Erro ao carregar animal:', error);
        }
      });
    }
  }

  salvar() {
    this.supabase.updateAnimal(this.animal.id, this.animal).subscribe({
      next: () => {
        this.mostrarToast('Animal atualizado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/detalhe', this.animal.id]);
        }, 1000);
      },
      error: (error) => {
        console.error('Erro ao atualizar:', error);
        this.mostrarToast('Erro ao atualizar animal!');
      }
    });
  }

  private mostrarToast(mensagem: string) {
    this.toastMessage = mensagem;
    this.showToast = true;
  }
}