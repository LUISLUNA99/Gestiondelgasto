-- Esquema de base de datos para Gestión de Gastos

-- Habilitar RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  icono VARCHAR(50) NOT NULL DEFAULT 'receipt',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de gastos
CREATE TABLE IF NOT EXISTS gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descripcion TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  usuario_id UUID NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios (opcional, para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_gastos_usuario_id ON gastos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria_id ON gastos(categoria_id);

-- Políticas RLS (Row Level Security)
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para gastos: los usuarios solo pueden ver sus propios gastos
CREATE POLICY "Los usuarios pueden ver sus propios gastos" ON gastos
  FOR ALL USING (auth.uid()::text = usuario_id::text);

-- Política para categorías: todos pueden ver las categorías
CREATE POLICY "Todos pueden ver categorías" ON categorias
  FOR SELECT USING (true);

-- Política para usuarios: los usuarios pueden ver su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON usuarios
  FOR ALL USING (auth.uid()::text = id::text);

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, color, icono) VALUES
  ('Alimentación', '#EF4444', 'utensils'),
  ('Transporte', '#3B82F6', 'car'),
  ('Entretenimiento', '#8B5CF6', 'film'),
  ('Salud', '#10B981', 'heart'),
  ('Educación', '#F59E0B', 'book'),
  ('Ropa', '#EC4899', 'shirt'),
  ('Hogar', '#6B7280', 'home'),
  ('Otros', '#9CA3AF', 'more-horizontal')
ON CONFLICT (nombre) DO NOTHING;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_gastos_updated_at BEFORE UPDATE ON gastos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
