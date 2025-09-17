-- Probar consulta directa para verificar datos
SELECT 
  empresa,
  COUNT(*) as total,
  MIN(codigo) as primer_codigo,
  MAX(codigo) as ultimo_codigo
FROM cuentas_contables 
WHERE activo = true
GROUP BY empresa
ORDER BY empresa;

-- Probar consulta con filtro específico
SELECT codigo, nombre, empresa 
FROM cuentas_contables 
WHERE activo = true 
  AND empresa = 'INOVITZ'
LIMIT 5;

-- Verificar si hay diferencias en la columna empresa
SELECT DISTINCT empresa, LENGTH(empresa) as longitud
FROM cuentas_contables 
WHERE activo = true;
