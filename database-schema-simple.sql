-- Esquema simplificado para Gestión de Gastos

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de gastos
CREATE TABLE IF NOT EXISTS gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descripcion TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  categoria VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);

-- Políticas RLS (Row Level Security) - deshabilitadas por simplicidad
-- ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Alimentación', 'Gastos en comida y bebida'),
  ('Transporte', 'Gastos en transporte público y privado'),
  ('Entretenimiento', 'Gastos en ocio y entretenimiento'),
  ('Salud', 'Gastos médicos y de salud'),
  ('Educación', 'Gastos en educación y formación'),
  ('Ropa', 'Gastos en ropa y accesorios'),
  ('Hogar', 'Gastos del hogar y mantenimiento'),
  ('Otros', 'Otros gastos no categorizados')
ON CONFLICT (nombre) DO NOTHING;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en gastos
CREATE TRIGGER update_gastos_updated_at BEFORE UPDATE ON gastos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
