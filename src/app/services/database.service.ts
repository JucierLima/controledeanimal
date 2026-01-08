import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isDbReady = false;

  constructor() {}

  async criarBanco() {
    try {
      // Aguardar o jeep-sqlite estar pronto no navegador
      if (!Capacitor.isNativePlatform()) {
        const jeepSqliteEl = document.querySelector('jeep-sqlite');
        if (jeepSqliteEl) {
          await customElements.whenDefined('jeep-sqlite');
          await (jeepSqliteEl as any).initWebStore();
        }
      }
      
      if (Capacitor.isNativePlatform()) {
        this.db = await this.sqlite.createConnection('cunicultura.db', false, 'no-encryption', 1, false);
      } else {
        this.db = await this.sqlite.createConnection('cunicultura.db', false, 'no-encryption', 1, true);
      }
      
      await this.db.open();

      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS animais (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT,
          sexo TEXT,
          idade TEXT,
          raca TEXT NOT NULL,
          cor TEXT NOT NULL,
          origem TEXT,
          filhos TEXT,
          data_cruzamento TEXT,
          tamanho TEXT NOT NULL,
          peso TEXT NOT NULL,
          descricao TEXT NOT NULL,
          imagem BLOB NOT NULL
        )
      `);
      
      this.isDbReady = true;
      console.log('Banco criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar banco:', error);
      throw error;
    }
  }

  async adicionarAnimal(animal: any) {
    try {
      if (!this.isDbReady) {
        await this.criarBanco();
      }
      
      const sql = `
        INSERT INTO animais 
        (nome, sexo, idade, raca, cor, origem, filhos, data_cruzamento, tamanho, peso, descricao, imagem)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const valores = [
        animal.nome || null,
        animal.sexo || null,
        animal.idade || null,
        animal.raca,
        animal.cor,
        animal.origem || null,
        animal.filhos || null,
        animal.data_cruzamento || null,
        animal.tamanho,
        animal.peso,
        animal.descricao,
        animal.imagem
      ];
      
      console.log('Executando SQL:', sql);
      console.log('Valores:', valores);
      
      const result = await this.db.run(sql, valores);
      console.log('Resultado:', result);
      return result;
    } catch (error) {
      console.error('Erro no adicionarAnimal:', error);
      throw error;
    }
  }

  async listarAnimais() {
    try {
      if (!this.isDbReady) {
        await this.criarBanco();
      }
      const result = await this.db.query('SELECT * FROM animais');
      
      // Converter BLOB para base64 para exibição
      const animais = result.values?.map((animal: any) => {
        if (animal.imagem) {
          const uint8Array = new Uint8Array(animal.imagem);
          const base64 = btoa(String.fromCharCode(...uint8Array));
          animal.imagemUrl = `data:image/jpeg;base64,${base64}`;
        }
        return animal;
      }) || [];
      
      return animais;
    } catch (error) {
      console.error('Erro ao listar animais:', error);
      return [];
    }
  }

  async obterAnimal(id: number) {
    try {
      if (!this.isDbReady) {
        await this.criarBanco();
      }
      const result = await this.db.query('SELECT * FROM animais WHERE id = ?', [id]);
      return result.values?.[0] || null;
    } catch (error) {
      console.error('Erro ao obter animal:', error);
      return null;
    }
  }
}