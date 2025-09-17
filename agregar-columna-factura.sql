-- Agregar columna factura_url a la tabla solicitudes_compra
ALTER TABLE solicitudes_compra 
ADD COLUMN factura_url TEXT;

-- Comentario para la columna
COMMENT ON COLUMN solicitudes_compra.factura_url IS 'URLs de archivos de factura separadas por comas';
