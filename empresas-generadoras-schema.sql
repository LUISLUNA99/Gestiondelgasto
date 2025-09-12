-- Script para crear catálogo de empresas generadoras
-- Ejecutar en Supabase SQL Editor

-- Eliminar tabla si existe
DROP TABLE IF EXISTS empresas_generadoras CASCADE;

-- Crear tabla de empresas generadoras
CREATE TABLE empresas_generadoras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar empresas generadoras
INSERT INTO empresas_generadoras (codigo, nombre) VALUES
('EG001', 'BUZZWORD'),
('EG002', 'INOVITZ');

-- Verificar datos insertados
SELECT 'Empresas Generadoras' as tabla, COUNT(*) as total FROM empresas_generadoras;

-- Mostrar datos insertados
SELECT codigo, nombre FROM empresas_generadoras ORDER BY codigo;
