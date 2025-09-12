-- Script para crear catálogos de clasificaciones
-- Ejecutar en Supabase SQL Editor

-- Crear tabla de clasificaciones iniciales
CREATE TABLE IF NOT EXISTS clasificaciones_iniciales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de clasificaciones de finanzas
CREATE TABLE IF NOT EXISTS clasificaciones_finanzas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar clasificaciones iniciales
INSERT INTO clasificaciones_iniciales (codigo, nombre) VALUES
('CI001', 'Comisiones Bancarias'),
('CI002', 'Impuestos'),
('CI003', 'Nómina'),
('CI004', 'Pago a proveedor'),
('CI005', 'Reembolso de gastos'),
('CI006', 'Vacías')
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  activo = EXCLUDED.activo;

-- Insertar clasificaciones de finanzas (mismas opciones)
INSERT INTO clasificaciones_finanzas (codigo, nombre) VALUES
('CF001', 'Comisiones Bancarias'),
('CF002', 'Impuestos'),
('CF003', 'Nómina'),
('CF004', 'Pago a proveedor'),
('CF005', 'Reembolso de gastos'),
('CF006', 'Vacías')
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  activo = EXCLUDED.activo;

-- Verificar datos insertados
SELECT 'Clasificaciones Iniciales' as tabla, COUNT(*) as total FROM clasificaciones_iniciales
UNION ALL
SELECT 'Clasificaciones Finanzas' as tabla, COUNT(*) as total FROM clasificaciones_finanzas;
