-- Agregar columnas para la 4ta fase de factura
ALTER TABLE solicitudes_compra 
ADD COLUMN status_factura VARCHAR(50) DEFAULT 'Pendiente',
ADD COLUMN fecha_factura TIMESTAMP WITH TIME ZONE;

-- Comentarios para las columnas
COMMENT ON COLUMN solicitudes_compra.status_factura IS 'Estado de la factura: Pendiente, Completado';
COMMENT ON COLUMN solicitudes_compra.fecha_factura IS 'Fecha cuando se adjuntó la factura';

-- Actualizar solicitudes existentes que ya tienen factura_url para marcarlas como completadas
UPDATE solicitudes_compra 
SET status_factura = 'Completado', 
    fecha_factura = NOW()
WHERE factura_url IS NOT NULL AND factura_url != '';
