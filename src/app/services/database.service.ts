import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  constructor() {}

  async criarBanco() {
    try {
      this.db = await this.sqlite.createConnection('cunicultura.db', false, 'no-encryption', 1, false);
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
          imagem TEXT
        )
      `);
    } catch (error) {
      console.error('Erro ao criar banco:', error);
    }
  }

  async adicionarAnimal(animal: any) {
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
      animal.imagem || null
    ];
    
    return await this.db.run(sql, valores);
  }

  async listarAnimais() {
    const result = await this.db.query('SELECT * FROM animais');
    return result.values || [];
  }

  async obterAnimal(id: number) {
    const result = await this.db.query('SELECT * FROM animais WHERE id = ?', [id]);
    return result.values?.[0] || null;
  }
}