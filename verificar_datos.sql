-- Verificar datos de cuentas contables
SELECT 
  empresa,
  COUNT(*) as total_registros,
  MIN(codigo) as primer_codigo,
  MAX(codigo) as ultimo_codigo
FROM cuentas_contables 
GROUP BY empresa
ORDER BY empresa;

-- Verificar algunos registros de INOVITZ
SELECT codigo, nombre, empresa 
FROM cuentas_contables 
WHERE empresa = 'INOVITZ' 
LIMIT 10;

-- Verificar algunos registros de BUZZWORD
SELECT codigo, nombre, empresa 
FROM cuentas_contables 
WHERE empresa = 'BUZZWORD' 
LIMIT 10;
