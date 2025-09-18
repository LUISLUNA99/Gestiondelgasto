-- Configuración de Supabase Storage para Gestión del Gasto
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Crear bucket para facturas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'facturas',
  'facturas',
  true,
  10485760, -- 10MB
  ARRAY['image/*', 'application/pdf', 'text/*', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
);

-- 2. Crear bucket para evidencias de pago
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidencias-pago',
  'evidencias-pago',
  true,
  10485760, -- 10MB
  ARRAY['image/*', 'application/pdf', 'text/*', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
);

-- 3. Configurar políticas RLS para el bucket de facturas
CREATE POLICY "Permitir lectura pública de facturas" ON storage.objects
FOR SELECT USING (bucket_id = 'facturas');

CREATE POLICY "Permitir subida de facturas" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'facturas');

CREATE POLICY "Permitir actualización de facturas" ON storage.objects
FOR UPDATE USING (bucket_id = 'facturas');

CREATE POLICY "Permitir eliminación de facturas" ON storage.objects
FOR DELETE USING (bucket_id = 'facturas');

-- 4. Configurar políticas RLS para el bucket de evidencias de pago
CREATE POLICY "Permitir lectura pública de evidencias" ON storage.objects
FOR SELECT USING (bucket_id = 'evidencias-pago');

CREATE POLICY "Permitir subida de evidencias" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'evidencias-pago');

CREATE POLICY "Permitir actualización de evidencias" ON storage.objects
FOR UPDATE USING (bucket_id = 'evidencias-pago');

CREATE POLICY "Permitir eliminación de evidencias" ON storage.objects
FOR DELETE USING (bucket_id = 'evidencias-pago');

-- 5. Verificar que los buckets se crearon correctamente
SELECT * FROM storage.buckets WHERE id IN ('facturas', 'evidencias-pago');
