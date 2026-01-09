import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private db: DatabaseService) {}

  async ngOnInit() {
    try {
      await this.db.init();
      console.log('App inicializado com SQLite');
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
    }
  }
}
