import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private iniciado = false;

  async init() {
    if (this.iniciado) return;

    try {
      if (!Capacitor.isNativePlatform()) {
        // Aguardar jeep-sqlite estar disponível
        const jeep = document.querySelector('jeep-sqlite');
        if (jeep) {
          await customElements.whenDefined('jeep-sqlite');
          await (jeep as any).initWebStore();
          console.log('jeep-sqlite inicializado');
        } else {
          console.error('jeep-sqlite não encontrado no DOM');
          throw new Error('jeep-sqlite não encontrado');
        }
      }

      this.db = await this.sqlite.createConnection(
        'cunicultura',
        false,
        'no-encryption',
        1,
        !Capacitor.isNativePlatform()
      );

      await this.db.open();
      console.log('Conexão SQLite aberta');

      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS animais (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT,
          sexo TEXT,
          idade TEXT,
          raca TEXT,
          cor TEXT,
          origem TEXT,
          filhos TEXT,
          data_cruzamento TEXT,
          tamanho TEXT,
          peso TEXT,
          descricao TEXT,
          imagem BLOB
        )
      `);
      console.log('Tabela criada');

      this.iniciado = true;
      console.log('SQLite pronto');
    } catch (error) {
      console.error('Erro ao inicializar SQLite:', error);
      throw error;
    }
  }

  async addAnimal(a: any) {
    try {
      await this.init();
      console.log('Adicionando animal:', a);

      const result = await this.db.run(
        `INSERT INTO animais
        (nome, sexo, idade, raca, cor, origem, filhos, data_cruzamento, tamanho, peso, descricao, imagem)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          a.nome ?? null,
          a.sexo ?? null,
          a.idade ?? null,
          a.raca ?? null,
          a.cor ?? null,
          a.origem ?? null,
          a.filhos ?? null,
          a.data_cruzamento ?? null,
          a.tamanho ?? null,
          a.peso ?? null,
          a.descricao ?? null,
          a.imagem ?? null
        ]
      );
      
      console.log('Animal adicionado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao adicionar animal:', error);
      throw error;
    }
  }

  async getAnimais(): Promise<any[]> {
    try {
      await this.init();
      console.log('Buscando animais...');
      
      const res = await this.db.query('SELECT * FROM animais');
      console.log('Resultado da query:', res);
      
      // Converter BLOB para base64
      const animais = res.values?.map((animal: any) => {
        console.log('Processando animal:', animal);
        if (animal.imagem) {
          try {
            const uint8Array = new Uint8Array(animal.imagem);
            const base64 = btoa(String.fromCharCode(...uint8Array));
            animal.imagemUrl = `data:image/jpeg;base64,${base64}`;
          } catch (error) {
            console.error('Erro ao converter imagem:', error);
          }
        }
        return animal;
      }) || [];
      
      console.log('Animais processados:', animais);
      return animais;
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
      return [];
    }
  }

  async getAnimal(id: number) {
    await this.init();
    const res = await this.db.query('SELECT * FROM animais WHERE id = ?', [id]);
    const animal = res.values?.[0] || null;
    
    if (animal && animal.imagem) {
      const uint8Array = new Uint8Array(animal.imagem);
      const base64 = btoa(String.fromCharCode(...uint8Array));
      animal.imagemUrl = `data:image/jpeg;base64,${base64}`;
    }
    
    return animal;
  }
}