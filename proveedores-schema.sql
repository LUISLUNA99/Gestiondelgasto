-- Script para crear catálogo de proveedores
-- Ejecutar en Supabase SQL Editor

-- Eliminar tabla si existe
DROP TABLE IF EXISTS proveedores CASCADE;

-- Crear tabla de proveedores
CREATE TABLE proveedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  rfc VARCHAR(13),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar proveedores random (temporales)
INSERT INTO proveedores (codigo, nombre, rfc) VALUES
('PROV001', 'Tecnología Avanzada S.A. de C.V.', 'TEC123456789'),
('PROV002', 'Servicios Corporativos del Norte', 'SCN987654321'),
('PROV003', 'Consultoría Empresarial Integral', 'CEI456789123'),
('PROV004', 'Suministros Industriales México', 'SIM789123456'),
('PROV005', 'Software Solutions Group', 'SSG321654987'),
('PROV006', 'Marketing Digital Pro', 'MDP654321987'),
('PROV007', 'Logística y Transporte Express', 'LTE987321654'),
('PROV008', 'Recursos Humanos Especializados', 'RHE147258369'),
('PROV009', 'Contabilidad y Finanzas Plus', 'CFP369258147'),
('PROV010', 'Infraestructura Tecnológica', 'INF258147369'),
('PROV011', 'Capacitación Empresarial', 'CAP741852963'),
('PROV012', 'Seguridad y Vigilancia Total', 'SVT963852741'),
('PROV013', 'Limpieza y Mantenimiento Pro', 'LMP852963741'),
('PROV014', 'Comunicaciones y Redes', 'CRN159753486'),
('PROV015', 'Gestión de Proyectos Avanzada', 'GPA486159753');

-- Verificar datos insertados
SELECT 'Proveedores' as tabla, COUNT(*) as total FROM proveedores;

-- Mostrar datos insertados
SELECT codigo, nombre, rfc FROM proveedores ORDER BY codigo;
