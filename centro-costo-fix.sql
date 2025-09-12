-- Script para corregir la tabla de centros de costo
-- Ejecutar en Supabase SQL Editor

-- Primero, verificar si la tabla existe y su estructura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'centros_costo' 
ORDER BY ordinal_position;

-- Si la tabla existe pero con estructura incorrecta, eliminarla
DROP TABLE IF EXISTS centros_costo CASCADE;

-- Crear la tabla con la estructura correcta
CREATE TABLE centros_costo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  empresa VARCHAR(100) NOT NULL,
  id_empresa INTEGER NOT NULL,
  cliente VARCHAR(100) NOT NULL,
  id_cliente INTEGER NOT NULL,
  nombre_actual VARCHAR(200) NOT NULL,
  id_unico INTEGER NOT NULL,
  centro_costo_anterior VARCHAR(50),
  nombre_anterior VARCHAR(200),
  activo BOOLEAN DEFAULT true,
  tipo_proyecto VARCHAR(100),
  clasificacion_comite VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_centros_costo_codigo ON centros_costo(codigo);
CREATE INDEX idx_centros_costo_empresa ON centros_costo(empresa);
CREATE INDEX idx_centros_costo_cliente ON centros_costo(cliente);
CREATE INDEX idx_centros_costo_activo ON centros_costo(activo);

-- Insertar datos del CSV
INSERT INTO centros_costo (
  codigo, empresa, id_empresa, cliente, id_cliente, nombre_actual, 
  id_unico, centro_costo_anterior, nombre_anterior, activo, 
  tipo_proyecto, clasificacion_comite
) VALUES 
('50-01-01', 'Buzzword', 50, 'Buenher', 1, 'Gestión - Buenher', 1, '50-24-00', 'BUENHER', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-02-02', 'Buzzword', 50, 'Buzzword', 2, 'Certificaciones - CMMI', 2, '03-10-00', 'Administración::Certificaciones::Buzzword CMMI 2.0', true, '3.- Certificaciones', '1.3.- Certificaciones'),
('50-02-03', 'Buzzword', 50, 'Buzzword', 2, 'Certificaciones - ISO 27001', 3, '03-12-00', 'Administración::Certificaciones::ISO 27001', true, '3.- Certificaciones', '1.3.- Certificaciones'),
('50-02-04', 'Buzzword', 50, 'Buzzword', 2, 'Certificaciones - NOM 151 PSC', 4, '16-02-00', 'Certificaciones::NOM 151 PSC', true, '3.- Certificaciones', '1.3.- Certificaciones'),
('50-02-05', 'Buzzword', 50, 'Buzzword', 2, 'Certificaciones - PCI', 5, '03-11-00', 'Administración::Certificaciones::PCI', true, '3.- Certificaciones', '1.3.- Certificaciones'),
('50-02-06', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Activos Intangibles Estrátegicos', 6, '50-29-00', 'Activos intangibles estrátegicos', true, '7.1- Administración', '4.-Generales y Administrativos'),
('50-02-07', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Activos Intangibles Tácticos', 7, '50-28-00', 'Activos intagibles tacticos', true, '7.3- Administración Mesa Directiva', '5.-Activos Intangibles Estratégicos'),
('50-02-08', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Activos Amortización', 8, '50-27-00', 'Generales amortización', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-09', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - ISN', 9, '50-07-00', 'Buzzwrod: ISN', true, '1.- Operación', '1.-Operación'),
('50-02-10', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - ISR', 10, '50-08-00', 'Buzzword: ISR Provisional', true, '8.4.- Impuestos Generales', '8.4.- Impuestos'),
('50-02-11', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Nómina', 11, '50-01-00', 'Administración::Buzzword - Nomina', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-12', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - SAP', 12, '50-18-00', 'Administración::Buzzword - Administración y finanzas::SAP', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-13', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword Gestión - SUA Patronal', 13, '50-06-00', 'Buzzword: SUA', true, '1.- Operación', '1.-Operación'),
('50-02-14', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Vacaciones', 14, '50-16-00', 'Administración::Buzzword Vacaciones', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-15', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Aplicaciones Móviles', 15, '50-14-00', 'Buzzword:Aplicaciones móviles', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-16', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - ART Background Check RRHH', 16, '50-30-00', 'ART BC RH', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-17', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - ART EU', 17, '15-52-00', 'Plataformas TI::ART EU', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-18', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - ART IA', 18, '50-05-00', 'Plataformas TI::ART IA', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-19', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - ART Mobile', 19, '50-31-00', 'ART Mobile', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-20', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Kakebo', 20, '14-54-00', 'Prospectos calificados::COIN', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-21', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Macro ART', 21, '15-53-00', 'Plataformas TI::Macro ART', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-22', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Página Buzzword', 22, '01-16-00', 'Generales::Página Buzz Word', true, '5.-Comercial', '3.-Ventas'),
('50-02-23', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Easy Factor', 23, '14-60-00', 'Prospectos calificados::Sistema de factoraje', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-24', 'Buzzword', 50, 'Buzzword', 2, 'Tecnología - Mesa de Ayuda', 24, '50-17-00', 'Tecnología::Buzzword - Mesa de ayuda', true, '1.- Operación', '1.-Operación'),
('50-02-25', 'Buzzword', 50, 'Buzzword', 2, 'Tecnología - Soporte', 25, '50-15-00', 'Tecnología::TI::Buzzword Soporte', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-26', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Finanzas y Contabilidad', 26, '02-31-00', 'Administración::Buzzword - Administración y finanzas', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-02-27', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Comercial', 27, '02-33-00', 'Administración::Buzzword - Comercial', true, '5.-Comercial', '3.-Ventas'),
('50-02-28', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Dirección General', 28, '02-36-00', 'Administración::Buzzword - Dirección General', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-02-29', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Generales', 29, '50-26-00', 'Generales buzzword', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-30', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Jurídico', 30, '50-10-00', 'Buzzword: Jurídico', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-31', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Marketing', 31, '02-32-00', 'Administración::Buzzword - Marketing', true, '5.-Comercial', '3.-Marketing'),
('50-02-32', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Producto', 32, '02-34-00', 'Administración::Buzzword - Producto', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-33', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Recursos humanos', 33, '02-35-00', 'Administración::Buzzword - Recursos Humanos', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-02-34', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Tecnología', 34, '50-09-00', 'Buzzword: Tecnología', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-35', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Página ART', 35, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-03-36', 'Buzzword', 50, 'BX+', 3, 'Proyectos - BX+', 36, '14-69-00', 'Prospectos calificados::BX+', true, '1.- Operación', '1.-Operación'),
('50-04-37', 'Buzzword', 50, 'Círculo de crédito', 4, 'Proyectos - Círculo de Crédito', 37, '50-19-00', 'Plataformas TI::Círculo de crédito', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-05-38', 'Buzzword', 50, 'CSI', 5, 'Gestión - CSI', 38, '50-25-00', 'CSI', true, '1.1- Operación Interna', '1.-Operación'),
('50-05-39', 'Buzzword', 50, 'CSI', 5, 'Proyectos - Página CSI', 39, '01-15-00', 'Generales::Página CSI', true, '5.-Comercial', '3.-Ventas'),
('50-06-40', 'Buzzword', 50, 'Davivienda', 6, 'Proyectos - Davivienda', 40, '50-12-00', 'Plataformas TI::Davivienda', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-07-41', 'Buzzword', 50, 'Elavon', 7, 'Proyectos - Elavon 390', 41, '13-12-00', 'Otros Proyectos::Elavon 390', true, '1.- Operación', '1.-Operación'),
('50-08-42', 'Buzzword', 50, 'Ethos Pay', 8, 'Proyectos - Ethos Pay', 42, '50-13-00', 'Plataformas TI::Ethos Pay', true, '1.- Operación', '1.-Operación'),
('50-10-43', 'Buzzword', 50, 'Fundación Gonzalo Río Arronte', 10, 'Proyectos - Fundación Gonzalo Río Arronte', 43, '07-16-00', 'Digitalización::Fundacion Gonzalo Rio Arronte', true, '1.- Operación', '1.-Operación'),
('50-11-44', 'Buzzword', 50, 'Global payments', 11, 'Proyectos - Global Payments Onboarding Digital', 44, '15-54-00', 'Plataformas TI::Global Payments - Onboarding', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-11-45', 'Buzzword', 50, 'Global payments', 11, 'Proyectos - Global Payments UPAEP', 45, '15-51-00', 'Plataformas TI::Global Payments UPAEP', true, '1.- Operación', '1.-Operación'),
('50-12-46', 'Buzzword', 50, 'Grupo Armstrong', 12, 'Proyectos - Grupo Armstrong', 46, '50-04-00', 'Plataformas TI::Grupo Armstrong', true, '1.- Operación', '1.-Operación'),
('50-13-47', 'Buzzword', 50, 'HSBC', 13, 'Proyectos - HSBC E-commerce', 47, '15-43-00', 'Plataformas TI::HSBC e-commerce', true, '1.- Operación', '1.-Operación'),
('50-13-48', 'Buzzword', 50, 'HSBC', 13, 'Proyectos - HSBC Viva', 48, '14-67-00', 'Prospectos calificados::HSBC Viva', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-14-49', 'Buzzword', 50, 'IMATI', 14, 'Gestión - IMATI', 49, '50-23-00', 'IMATI', true, '1.1- Operación Interna', '1.-Operación'),
('50-15-50', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Conekta Inovitz', 50, '50-21-00', 'Conekta - Inovitz', true, '1.1- Operación Interna', '1.-Operación'),
('50-15-51', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - IFT/Cobranza Inovitz', 51, '04-55-00', 'Centro de Atención Telefónica::IFT / Cobranza', true, '1.1- Operación Interna', '1.-Operación'),
('50-15-52', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Suburbia Inovitz', 52, '50-22-00', 'Suburbia - Inovitz', true, '1.1- Operación Interna', '1.-Operación'),
('50-15-53', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Verificaciones Teléfonicas Inovitz', 53, '50-20-00', 'Verificaciones telefonicas - Inovitz', true, '1.1- Operación Interna', '1.-Operación'),
('50-15-54', 'Buzzword', 50, 'Inovitz', 15, 'Proyectos - Líneas aéreas Inovitz', 54, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-15-55', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Inovitz', 55, 'NA', 'NA', true, '1.1- Operación Interna', '1.-Operación'),
('50-16-56', 'Buzzword', 50, 'Joyerías dinasti', 16, 'Proyectos - Joyerías Dinasti', 56, '15-58-00', 'Plataformas TI::Joyerias Dinasti', true, '1.- Operación', '1.-Operación'),
('50-17-57', 'Buzzword', 50, 'Liverpool', 17, 'Proyectos - Livercash', 57, '15-48-00', 'Plataformas TI::Livercash', true, '1.- Operación', '1.-Operación'),
('50-18-58', 'Buzzword', 50, 'Multiva', 18, 'Proyectos - Multiva Nómina WEB', 58, '15-44-00', 'Prospectos calificados::MULTIVA Nómina', true, '1.- Operación', '1.-Operación'),
('50-18-59', 'Buzzword', 50, 'Multiva', 18, 'Proyectos - Multiva Nómina Digital APP', 59, '15-57-00', 'Plataformas TI::MULTIVA Nómina Digital', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-18-60', 'Buzzword', 50, 'Multiva', 18, 'Proyectos - Multiva GEA', 60, 'NA', 'NA', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-19-61', 'Buzzword', 50, 'PEMEX', 19, 'Proyectos - PEMEX', 61, '11-29-00', 'Plataformas TI::PEMEX', true, '1.- Operación', '1.-Operación'),
('50-20-62', 'Buzzword', 50, 'Planet media', 20, 'Proyectos - Planet Media', 62, '16-03-00', 'Administración::Certificaciones::Planet media', true, '1.- Operación', '1.-Operación'),
('50-21-63', 'Buzzword', 50, 'Santander', 21, 'Proyectos - Línea única Efectivo', 63, '15-09-00', 'Plataformas TI::Linea unica - Efectivo', true, '1.- Operación', '1.-Operación'),
('50-21-64', 'Buzzword', 50, 'Santander', 21, 'Proyectos - Línea única Nómina', 64, '15-24-00', 'Plataformas TI::Linea unica - Nomina', true, '1.- Operación', '1.-Operación'),
('50-21-65', 'Buzzword', 50, 'Santander', 21, 'Proyectos - Línea única Tarjetas', 65, '15-25-00', 'Plataformas TI::Linea unica - Tarjetas', true, '1.- Operación', '1.-Operación'),
('50-21-66', 'Buzzword', 50, 'Santander', 21, 'Proyectos - Santander Internet', 66, '15-08-00', 'Plataformas TI::Santander Internet', true, '1.- Operación', '1.-Operación'),
('50-22-67', 'Buzzword', 50, 'Suburbia', 22, 'Proyectos - Suburbia', 67, '14-55-00', 'Prospectos calificados::Suburbia', true, '1.- Operación', '1.-Operación'),
('50-23-68', 'Buzzword', 50, 'T Systems', 23, 'Gestión - T Systems Agile', 68, '50-03-01', 'Plataformas TI::T-SYSTEMS AGILE', false, '1.1- Operación Interna', '1.-Operación'),
('50-24-69', 'Buzzword', 50, 'Zurich Santander', 24, 'Proyectos - SEL Zurich', 69, '14-53-00', 'Prospectos calificados::SEL Zurich', true, '1.- Operación', '1.-Operación'),
('50-02-70', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Certificaciones', 70, 'NA', 'NA', true, '3.- Certificaciones', '1.3.- Certificaciones'),
('50-15-71', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Yavo Capital', 71, 'NA', 'NA', true, '1.1- Operación Interna', '1.-Operación'),
('50-02-72', 'Buzzword', 50, 'Buzzword', 2, 'Prorrateos Activos Tangibles', 72, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-73', 'Buzzword', 50, 'Buzzword', 2, 'Prorrateos Licencias', 73, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-74', 'Buzzword', 50, 'Buzzword', 2, 'Prorrateos Certificaciones', 74, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-75', 'Buzzword', 50, 'Buzzword', 2, 'Producto - VivaNómada', 75, 'NA', 'NA', true, '4.1-Innovación', '2.-Investigación y Desarrollo'),
('50-02-76', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos - Firma Digital', 76, 'NA', 'NA', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-77', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Inversiones Buzzword', 77, 'NA', 'NA', true, '8.3.- Inversiones', '8.3.- Inversiones'),
('50-02-78', 'Buzzword', 50, 'Buzzword', 2, 'Producto - ART Inmobiliarias', 78, 'NA', 'NA', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-79', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Incidencias', 79, 'NA', 'NA', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-25-80', 'Buzzword', 50, 'Sosa Jhons', 25, 'Proyectos - FWS Now Me', 80, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-26-81', 'Buzzword', 50, 'MIDE', 26, 'Proyectos - FWS MIDE', 81, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-27-82', 'Buzzword', 50, 'Rapicash', 27, 'Proyectos - ART Rapicash', 82, 'NA', 'NA', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-83', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Global', 83, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-02-84', 'Buzzword', 50, 'Buzzword', 2, 'Proyectos- CSI Financial Hub', 84, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-11-85', 'Buzzword', 50, 'Buzzword', 11, 'Proyectos - Certificación de expedientes', 85, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-28-86', 'Buzzword', 50, 'Ingersoll Rand', 28, 'Proyectos - IR Cotizadores', 86, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-02-87', 'Buzzword', 50, 'Buzzword', 2, 'Prorrateos Generales', 87, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-29-88', 'Buzzword', 50, 'HSBC', 29, 'Proyectos - HSBC Tarjetas', 88, 'NA', 'NA', true, '4.-Innovación', '2.-Investigación y Desarrollo'),
('50-02-89', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Mesa directiva', 89, 'NA', 'NA', true, '7.3- Administración Mesa Directiva', '5.-Activos Intangibles Estratégicos'),
('50-02-90', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Gestión SUA Obrero', 90, 'NA', 'NA', true, '1.- Operación', '1.-Operación'),
('50-02-91', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Vigilancia', 91, 'NA', 'NA', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-02-92', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Administracion Empresarial', 92, 'NA', 'NA', true, '7.2- Administración', '4.-Generales y Administrativos'),
('50-02-93', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - RRHH Capacitación', 93, 'NA', 'NA', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-18-94', 'Buzzword', 50, 'Buzzword', 18, 'Multiva - Médicos', 94, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-15-95', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Soporte Interno INOVITZ', 95, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-96', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Generales Operaciones (Servers)', 96, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-30-97', 'Buzzword', 50, 'TERGUM', 30, 'Gestión - Nómina TERGUM', 97, 'NA', 'NA', true, '7.- Administración', '4.-Generales y Administrativos'),
('50-02-98', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Finiquitos Buzzword', 98, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-99', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - PTU', 99, 'NA', 'NA', true, '9.- Administración', '9.- Administración'),
('50-02-100', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Nómina FIDEICOMISO', 100, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-101', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - INFONAVIT y FONACOT', 101, 'NA', 'NA', true, '8.4.- Impuestos Generales', '8.4.- Impuestos'),
('50-31-102', 'Buzzword', 50, 'FUENTES JASSO', 31, 'Gestión - Fuentes Jasso', 102, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-01-103', 'Buzzword', 50, 'Buenher', 1, 'Gestión - Cuentas Buzzword a BUENHER', 103, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-02-104', 'Buzzword', 50, 'Buzzword', 2, 'Gestión - Cuentas Buzzword a BUZZWORD', 104, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-05-105', 'Buzzword', 50, 'CSI', 5, 'Gestión - Cuentas Buzzword a CSI', 105, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-14-106', 'Buzzword', 50, 'IMATI', 14, 'Gestión - Cuentas Buzzword a IMATI', 106, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-15-107', 'Buzzword', 50, 'Inovitz', 15, 'Gestión - Cuentas Buzzword a INOVITZ', 107, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-32-108', 'Buzzword', 50, 'Digital', 32, 'Gestión - Cuentas Buzzword a DIGITAL', 108, 'NA', 'NA', true, '9.- Administración', '9.- Estrategias Fiscales'),
('50-02-109', 'Buzzword', 50, 'Buzzword', 2, 'Prorrateos Seguros', 109, 'NA', 'NA', true, '2.-Administración Operativa', '1.-Operación'),
('50-02-110', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Amortizaciones', 110, 'NA', 'NA', true, '8.1.- Amortizaciones', '8.1.- Amortizaciones'),
('50-02-111', 'Buzzword', 50, 'Buzzword', 2, 'Buzzword - Depreciaciones', 111, 'NA', 'NA', true, '8.2.- Depreciaciones', '8.2.- Depreciaciones');

-- Verificar que los datos se insertaron correctamente
SELECT COUNT(*) as total_centros_costo FROM centros_costo;
SELECT codigo, nombre_actual, cliente, activo FROM centros_costo ORDER BY codigo LIMIT 10;
