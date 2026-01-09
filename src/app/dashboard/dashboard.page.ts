import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, RouterModule, IonButton]
})
export class DashboardPage {

  animais: any[] = [];

  constructor(private storage: StorageService) {}

  ionViewWillEnter() {
    console.log('Entrou no Dashboard');
    this.animais = this.storage.getAll();
    console.log('Animais carregados:', this.animais);
  }

}
