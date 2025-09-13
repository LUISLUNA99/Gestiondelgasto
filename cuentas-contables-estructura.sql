-- Crear tabla de cuentas contables con todas las columnas del Excel
DROP TABLE IF EXISTS cuentas_contables CASCADE;
CREATE TABLE cuentas_contables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nivel VARCHAR(10),
  codigo VARCHAR(50) NOT NULL,
  nombre VARCHAR(500),
  tipo VARCHAR(200),
  tipo_2 VARCHAR(200),
  dig_agr VARCHAR(200),
  edo_fin VARCHAR(200),
  moneda VARCHAR(200),
  seg_neg VARCHAR(200),
  rubro_nif VARCHAR(200),
  agrupador_sat VARCHAR(200),
  empresa VARCHAR(20) NOT NULL CHECK (empresa IN ('BUZZWORD', 'INOVITZ')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nota: Los datos reales del Excel se insertarán por separado
-- Este archivo contiene solo la estructura de la tabla con todas las columnas
