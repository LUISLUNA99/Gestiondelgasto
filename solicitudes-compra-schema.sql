-- Crear tabla de solicitudes de compra
DROP TABLE IF EXISTS solicitudes_compra CASCADE;
CREATE TABLE solicitudes_compra (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio VARCHAR(50) UNIQUE NOT NULL,
  fecha_solicitud DATE NOT NULL,
  solicitante VARCHAR(255) NOT NULL,
  centro_costo VARCHAR(50),
  proyecto VARCHAR(255),
  clasificacion_inicial VARCHAR(100),
  mes_servicio VARCHAR(20),
  mes_pago VARCHAR(20),
  empresa_generadora VARCHAR(100),
  empresa_pagadora VARCHAR(100),
  codigo_contable VARCHAR(50),
  total_estimado DECIMAL(15,2) DEFAULT 0,
  
  -- ETAPA 2: AUTORIZACIÓN
  status_autorizacion VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, Aprobado, Rechazado
  autorizado_por VARCHAR(255),
  fecha_autorizacion TIMESTAMP WITH TIME ZONE,
  observacion_autorizacion TEXT,
  
  -- ETAPA 3: FINANZAS
  status_finanzas VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, Procesado
  clasificacion_finanzas VARCHAR(100),
  codigo_contable_finanzas VARCHAR(50),
  estado_pago VARCHAR(50), -- Pendiente, Pagado, Parcial
  evidencia_pago_url VARCHAR(500),
  observaciones_finanzas TEXT,
  procesado_por VARCHAR(255),
  fecha_procesamiento TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de bienes de solicitudes
DROP TABLE IF EXISTS bienes_solicitud CASCADE;
CREATE TABLE bienes_solicitud (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitud_id UUID NOT NULL REFERENCES solicitudes_compra(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  descripcion TEXT NOT NULL,
  monto_estimado DECIMAL(15,2) NOT NULL DEFAULT 0,
  moneda VARCHAR(10) DEFAULT 'MXN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_solicitudes_folio ON solicitudes_compra(folio);
CREATE INDEX idx_solicitudes_solicitante ON solicitudes_compra(solicitante);
CREATE INDEX idx_solicitudes_fecha ON solicitudes_compra(fecha_solicitud);
CREATE INDEX idx_bienes_solicitud_id ON bienes_solicitud(solicitud_id);

-- Habilitar RLS
ALTER TABLE solicitudes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE bienes_solicitud ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para solicitudes_compra
CREATE POLICY "Enable read access for all users" ON solicitudes_compra
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON solicitudes_compra
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON solicitudes_compra
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON solicitudes_compra
    FOR DELETE USING (true);

-- Políticas RLS para bienes_solicitud
CREATE POLICY "Enable read access for all users" ON bienes_solicitud
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON bienes_solicitud
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON bienes_solicitud
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON bienes_solicitud
    FOR DELETE USING (true);
