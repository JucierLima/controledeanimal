-- Criar tabela animal (DADOS GLOBAIS - SEM FILTROS)
CREATE TABLE IF NOT EXISTS animal (
  id BIGINT PRIMARY KEY,
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

-- REMOVER device_id se existir
ALTER TABLE animal DROP COLUMN IF EXISTS device_id;

-- REMOVER RLS para permitir acesso global
ALTER TABLE animal DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Permitir inserção por device_id" ON animal;
DROP POLICY IF EXISTS "Permitir leitura por device_id" ON animal;
DROP POLICY IF EXISTS "Permitir atualização por device_id" ON animal;
DROP POLICY IF EXISTS "Permitir exclusão por device_id" ON animal;

-- Garantir que todos possam acessar os dados
GRANT ALL ON animal TO anon;
GRANT ALL ON animal TO authenticated;