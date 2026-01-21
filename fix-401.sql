-- Execute este SQL no painel do Supabase para resolver o erro 401

-- 1. Criar/recriar tabela com permissões corretas
DROP TABLE IF EXISTS public.animal;

CREATE TABLE public.animal (
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

-- 2. Desabilitar RLS completamente
ALTER TABLE public.animal DISABLE ROW LEVEL SECURITY;

-- 3. Dar todas as permissões
GRANT ALL PRIVILEGES ON public.animal TO anon;
GRANT ALL PRIVILEGES ON public.animal TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;