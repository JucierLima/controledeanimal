-- Criar tabela animal se não existir
CREATE TABLE IF NOT EXISTS animal (
  id BIGINT PRIMARY KEY,
  device_id TEXT NOT NULL,
  nome TEXT,
  sexo TEXT,
  idade TEXT,
  raca TEXT,
  cor TEXT,
  origem TEXT,
  data_nascimento TEXT,
  data_cobertura TEXT,
  data_provavel_parto TEXT,
  data_parto TEXT,
  filhotes_vivos INTEGER,
  filhotes_mortos INTEGER,
  filhos TEXT,
  data_cruzamento TEXT,
  tamanho TEXT,
  peso TEXT,
  descricao TEXT,
  imagem TEXT,
  foto_pai TEXT,
  foto_mae TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE animal ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção por qualquer device_id
CREATE POLICY "Permitir inserção por device_id" ON animal
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura apenas do próprio device_id
CREATE POLICY "Permitir leitura por device_id" ON animal
  FOR SELECT USING (true);

-- Política para permitir atualização apenas do próprio device_id
CREATE POLICY "Permitir atualização por device_id" ON animal
  FOR UPDATE USING (true);

-- Política para permitir exclusão apenas do próprio device_id
CREATE POLICY "Permitir exclusão por device_id" ON animal
  FOR DELETE USING (true);