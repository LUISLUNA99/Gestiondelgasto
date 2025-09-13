-- Verificar políticas RLS existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'cuentas_contables';

-- Eliminar políticas RLS existentes si las hay
DROP POLICY IF EXISTS "Enable read access for all users" ON cuentas_contables;
DROP POLICY IF EXISTS "Enable insert for all users" ON cuentas_contables;
DROP POLICY IF EXISTS "Enable update for all users" ON cuentas_contables;
DROP POLICY IF EXISTS "Enable delete for all users" ON cuentas_contables;

-- Crear políticas RLS que permitan acceso completo a todos los usuarios
CREATE POLICY "Enable read access for all users" ON cuentas_contables
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON cuentas_contables
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON cuentas_contables
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON cuentas_contables
    FOR DELETE USING (true);

-- Verificar que RLS esté habilitado
ALTER TABLE cuentas_contables ENABLE ROW LEVEL SECURITY;

-- Verificar las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'cuentas_contables';
