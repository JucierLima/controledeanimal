-- 1. Criar tabela animal
CREATE TABLE IF NOT EXISTS public.animal (
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

-- 2. Remover device_id se existir
ALTER TABLE public.animal DROP COLUMN IF EXISTS device_id;

-- 3. Desabilitar RLS
ALTER TABLE public.animal DISABLE ROW LEVEL SECURITY;

-- 4. Dar permissões completas
GRANT ALL ON public.animal TO anon;
GRANT ALL ON public.animal TO authenticated;
GRANT ALL ON public.animal TO service_role;