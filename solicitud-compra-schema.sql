-- Esquema para Solicitudes de Compra

-- Tabla de estados de solicitud
CREATE TABLE IF NOT EXISTS estados_solicitud (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tipos de solicitud
CREATE TABLE IF NOT EXISTS tipos_solicitud (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  requiere_aprobacion BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de departamentos/áreas
CREATE TABLE IF NOT EXISTS departamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  codigo VARCHAR(20) UNIQUE,
  responsable_id UUID,
  presupuesto_anual DECIMAL(15,2),
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

-- Tabla principal de solicitudes de compra
CREATE TABLE IF NOT EXISTS solicitudes_compra (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio VARCHAR(50) UNIQUE NOT NULL,
  tipo_solicitud_id UUID REFERENCES tipos_solicitud(id),
  departamento_id UUID REFERENCES departamentos(id),
  solicitante_id UUID NOT NULL,
  fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_requerida DATE,
  justificacion TEXT NOT NULL,
  estado_id UUID REFERENCES estados_solicitud(id),
  monto_total DECIMAL(15,2) DEFAULT 0,
  moneda VARCHAR(3) DEFAULT 'MXN',
  observaciones TEXT,
  aprobado_por UUID,
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  rechazado_por UUID,
  fecha_rechazo TIMESTAMP WITH TIME ZONE,
  motivo_rechazo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de artículos/productos de la solicitud
CREATE TABLE IF NOT EXISTS solicitud_articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitud_id UUID REFERENCES solicitudes_compra(id) ON DELETE CASCADE,
  codigo_producto VARCHAR(100),
  descripcion TEXT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL,
  precio_unitario DECIMAL(10,2),
  precio_total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * COALESCE(precio_unitario, 0)) STORED,
  proveedor_sugerido_id UUID REFERENCES proveedores(id),
  especificaciones_tecnicas TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de archivos adjuntos
CREATE TABLE IF NOT EXISTS solicitud_adjuntos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitud_id UUID REFERENCES solicitudes_compra(id) ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  tipo_archivo VARCHAR(100),
  tamaño_bytes BIGINT,
  url_archivo TEXT NOT NULL,
  descripcion TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_folio ON solicitudes_compra(folio);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_compra(estado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_solicitante ON solicitudes_compra(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes_compra(fecha_solicitud);
CREATE INDEX IF NOT EXISTS idx_articulos_solicitud ON solicitud_articulos(solicitud_id);

-- Políticas RLS
ALTER TABLE solicitudes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_adjuntos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades)
CREATE POLICY "Usuarios pueden ver sus propias solicitudes" ON solicitudes_compra
  FOR ALL USING (auth.uid()::text = solicitante_id::text);

CREATE POLICY "Usuarios pueden ver artículos de sus solicitudes" ON solicitud_articulos
  FOR ALL USING (
    solicitud_id IN (
      SELECT id FROM solicitudes_compra 
      WHERE solicitante_id::text = auth.uid()::text
    )
  );

-- Insertar datos iniciales
INSERT INTO estados_solicitud (nombre, descripcion, color, orden) VALUES
  ('Borrador', 'Solicitud en proceso de creación', '#6B7280', 1),
  ('Pendiente', 'Esperando aprobación', '#F59E0B', 2),
  ('Aprobada', 'Solicitud aprobada', '#10B981', 3),
  ('Rechazada', 'Solicitud rechazada', '#EF4444', 4),
  ('En Compra', 'Proceso de compra iniciado', '#3B82F6', 5),
  ('Completada', 'Solicitud completada', '#8B5CF6', 6)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO tipos_solicitud (nombre, descripcion, requiere_aprobacion) VALUES
  ('Equipo de Cómputo', 'Computadoras, laptops, impresoras, etc.', true),
  ('Mobiliario', 'Escritorios, sillas, estanterías, etc.', true),
  ('Suministros', 'Material de oficina, papelería, etc.', false),
  ('Servicios', 'Consultoría, mantenimiento, etc.', true),
  ('Materiales', 'Materia prima, componentes, etc.', true),
  ('Otros', 'Otros tipos de solicitudes', true)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO departamentos (nombre, codigo) VALUES
  ('Administración', 'ADM'),
  ('Recursos Humanos', 'RH'),
  ('Tecnologías de la Información', 'TI'),
  ('Finanzas', 'FIN'),
  ('Ventas', 'VTA'),
  ('Marketing', 'MKT'),
  ('Operaciones', 'OPS'),
  ('Calidad', 'CAL')
ON CONFLICT (nombre) DO NOTHING;

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
  folio_generado := 'SC-' || TO_CHAR(NEW.fecha_solicitud, 'YYYY') || '-' || LPAD(contador::TEXT, 6, '0');
  
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

-- Trigger para actualizar monto total cuando cambian los artículos
CREATE OR REPLACE FUNCTION actualizar_monto_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE solicitudes_compra 
  SET monto_total = (
    SELECT COALESCE(SUM(precio_total), 0)
    FROM solicitud_articulos 
    WHERE solicitud_id = COALESCE(NEW.solicitud_id, OLD.solicitud_id)
  )
  WHERE id = COALESCE(NEW.solicitud_id, OLD.solicitud_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_monto
  AFTER INSERT OR UPDATE OR DELETE ON solicitud_articulos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_monto_total();
