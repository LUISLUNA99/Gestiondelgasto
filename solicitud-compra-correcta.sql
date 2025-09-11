-- Esquema correcto para Solicitudes de Compra basado en los 21 campos específicos

-- Tabla de clasificaciones iniciales
CREATE TABLE IF NOT EXISTS clasificaciones_iniciales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clasificaciones de finanzas
CREATE TABLE IF NOT EXISTS clasificaciones_finanzas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de meses de servicio
CREATE TABLE IF NOT EXISTS meses_servicio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de meses de pago
CREATE TABLE IF NOT EXISTS meses_pago (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de empresas generadoras del gasto
CREATE TABLE IF NOT EXISTS empresas_generadoras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  codigo VARCHAR(20) UNIQUE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de empresas que pagan
CREATE TABLE IF NOT EXISTS empresas_pagadoras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  codigo VARCHAR(20) UNIQUE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  rfc VARCHAR(13),
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(100),
  contacto VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de centros de costo
CREATE TABLE IF NOT EXISTS centros_costo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  codigo VARCHAR(20) UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de códigos contables
CREATE TABLE IF NOT EXISTS codigos_contables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de status de aprobación
CREATE TABLE IF NOT EXISTS status_aprobacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  color VARCHAR(7) DEFAULT '#6B7280',
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla principal de solicitudes de compra
CREATE TABLE IF NOT EXISTS solicitudes_compra (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio VARCHAR(50) UNIQUE NOT NULL,
  
  -- Campos de la solicitud
  clasificacion_inicial_id UUID REFERENCES clasificaciones_iniciales(id),
  clasificacion_finanzas_id UUID REFERENCES clasificaciones_finanzas(id),
  mes_servicio_id UUID REFERENCES meses_servicio(id),
  mes_pago_id UUID REFERENCES meses_pago(id),
  empresa_generadora_id UUID REFERENCES empresas_generadoras(id),
  empresa_pagadora_id UUID REFERENCES empresas_pagadoras(id),
  concepto_pago TEXT,
  proveedor_id UUID REFERENCES proveedores(id),
  centro_costo_id UUID REFERENCES centros_costo(id),
  proyecto TEXT,
  codigo_contable_id UUID REFERENCES codigos_contables(id),
  no_factura TEXT,
  
  -- Campos monetarios
  importe_me_iva_incluido DECIMAL(15,2) DEFAULT 0,
  importe_sin_iva_mn DECIMAL(15,2) DEFAULT 0,
  iva DECIMAL(15,2) DEFAULT 0,
  importe_mn_iva_incluido DECIMAL(15,2) DEFAULT 0,
  
  -- Campos de texto
  observaciones_cxp TEXT,
  status_aprobacion_id UUID REFERENCES status_aprobacion(id),
  observaciones_tesoreria TEXT,
  
  -- Campos de archivos
  evidencia_factura_pdf TEXT,
  evidencia_pago_pdf TEXT,
  
  -- Metadatos
  solicitante_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_folio ON solicitudes_compra(folio);
CREATE INDEX IF NOT EXISTS idx_solicitudes_status ON solicitudes_compra(status_aprobacion_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_solicitante ON solicitudes_compra(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes_compra(created_at);

-- Políticas RLS
ALTER TABLE solicitudes_compra ENABLE ROW LEVEL SECURITY;

-- Política básica (ajustar según necesidades)
CREATE POLICY "Usuarios pueden ver sus propias solicitudes" ON solicitudes_compra
  FOR ALL USING (auth.uid()::text = solicitante_id::text);

-- Función para generar folio automático
CREATE OR REPLACE FUNCTION generar_folio_solicitud()
RETURNS TRIGGER AS $$
DECLARE
  contador INTEGER;
  folio_generado VARCHAR(50);
BEGIN
  -- Obtener el siguiente número de secuencia
  SELECT COALESCE(MAX(CAST(SUBSTRING(folio FROM 'SC-(\d+)') AS INTEGER)), 0) + 1
  INTO contador
  FROM solicitudes_compra
  WHERE folio ~ '^SC-\d+$';
  
  -- Generar folio con formato SC-YYYY-NNNNNN
  folio_generado := 'SC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(contador::TEXT, 6, '0');
  
  NEW.folio := folio_generado;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar folio automáticamente
CREATE TRIGGER trigger_generar_folio
  BEFORE INSERT ON solicitudes_compra
  FOR EACH ROW
  WHEN (NEW.folio IS NULL OR NEW.folio = '')
  EXECUTE FUNCTION generar_folio_solicitud();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_solicitudes_updated_at BEFORE UPDATE ON solicitudes_compra
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos iniciales para catálogos

-- Clasificaciones iniciales
INSERT INTO clasificaciones_iniciales (nombre, descripcion) VALUES
  ('Gasto Operativo', 'Gastos relacionados con la operación diaria'),
  ('Gasto de Capital', 'Inversiones en activos fijos'),
  ('Gasto Administrativo', 'Gastos de administración general'),
  ('Gasto de Ventas', 'Gastos relacionados con ventas y marketing'),
  ('Gasto de Producción', 'Gastos del proceso productivo')
ON CONFLICT (nombre) DO NOTHING;

-- Clasificaciones de finanzas
INSERT INTO clasificaciones_finanzas (nombre, descripcion) VALUES
  ('Gasto Directo', 'Gasto directamente relacionado con la producción'),
  ('Gasto Indirecto', 'Gasto no directamente relacionado con la producción'),
  ('Gasto Fijo', 'Gasto que no varía con el volumen'),
  ('Gasto Variable', 'Gasto que varía con el volumen'),
  ('Gasto Semifijo', 'Gasto con componentes fijos y variables')
ON CONFLICT (nombre) DO NOTHING;

-- Meses de servicio
INSERT INTO meses_servicio (nombre, codigo) VALUES
  ('Enero', 'ENE'), ('Febrero', 'FEB'), ('Marzo', 'MAR'),
  ('Abril', 'ABR'), ('Mayo', 'MAY'), ('Junio', 'JUN'),
  ('Julio', 'JUL'), ('Agosto', 'AGO'), ('Septiembre', 'SEP'),
  ('Octubre', 'OCT'), ('Noviembre', 'NOV'), ('Diciembre', 'DIC')
ON CONFLICT (nombre) DO NOTHING;

-- Meses de pago
INSERT INTO meses_pago (nombre, codigo) VALUES
  ('Enero', 'ENE'), ('Febrero', 'FEB'), ('Marzo', 'MAR'),
  ('Abril', 'ABR'), ('Mayo', 'MAY'), ('Junio', 'JUN'),
  ('Julio', 'JUL'), ('Agosto', 'AGO'), ('Septiembre', 'SEP'),
  ('Octubre', 'OCT'), ('Noviembre', 'NOV'), ('Diciembre', 'DIC')
ON CONFLICT (nombre) DO NOTHING;

-- Empresas generadoras
INSERT INTO empresas_generadoras (nombre, codigo) VALUES
  ('Empresa Principal', 'EMP001'),
  ('Sucursal Norte', 'SUC001'),
  ('Sucursal Sur', 'SUC002'),
  ('Filial Internacional', 'FIL001')
ON CONFLICT (nombre) DO NOTHING;

-- Empresas pagadoras
INSERT INTO empresas_pagadoras (nombre, codigo) VALUES
  ('Cuenta Principal', 'CTA001'),
  ('Cuenta de Gastos', 'CTA002'),
  ('Cuenta de Inversión', 'CTA003'),
  ('Cuenta de Operaciones', 'CTA004')
ON CONFLICT (nombre) DO NOTHING;

-- Centros de costo
INSERT INTO centros_costo (nombre, codigo, descripcion) VALUES
  ('Administración', 'CC001', 'Centro de costo administrativo'),
  ('Ventas', 'CC002', 'Centro de costo de ventas'),
  ('Producción', 'CC003', 'Centro de costo de producción'),
  ('Marketing', 'CC004', 'Centro de costo de marketing'),
  ('Recursos Humanos', 'CC005', 'Centro de costo de RRHH'),
  ('Tecnología', 'CC006', 'Centro de costo de TI')
ON CONFLICT (nombre) DO NOTHING;

-- Códigos contables
INSERT INTO codigos_contables (codigo, descripcion) VALUES
  ('1000', 'Activos Circulantes'),
  ('2000', 'Activos Fijos'),
  ('3000', 'Pasivos Circulantes'),
  ('4000', 'Pasivos a Largo Plazo'),
  ('5000', 'Capital Contable'),
  ('6000', 'Ingresos'),
  ('7000', 'Costos de Ventas'),
  ('8000', 'Gastos de Operación'),
  ('9000', 'Otros Ingresos y Gastos')
ON CONFLICT (codigo) DO NOTHING;

-- Status de aprobación
INSERT INTO status_aprobacion (nombre, descripcion, color, orden) VALUES
  ('Pendiente', 'Esperando aprobación inicial', '#F59E0B', 1),
  ('En Revisión', 'En proceso de revisión', '#3B82F6', 2),
  ('Aprobada', 'Solicitud aprobada', '#10B981', 3),
  ('Rechazada', 'Solicitud rechazada', '#EF4444', 4),
  ('En Proceso', 'En proceso de compra', '#8B5CF6', 5),
  ('Completada', 'Solicitud completada', '#059669', 6)
ON CONFLICT (nombre) DO NOTHING;
