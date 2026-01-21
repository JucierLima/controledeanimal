import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HybridService } from '../services/hybrid.service';

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
    private hybrid: HybridService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hybrid.getAnimal(parseInt(id)).subscribe({
        next: (animal) => {
          this.animal = animal;
        },
        error: (error) => {
          console.error('Erro ao carregar animal:', error);
        }
      });
    }
  }

}
