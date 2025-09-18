#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Activando SharePoint real...\n');

// Función para activar SharePoint en App.tsx
function activarSharePoint() {
  console.log('1. 📝 Activando SharePoint en App.tsx...');
  
  const appPath = path.join(__dirname, 'src/App.tsx');
  let content = fs.readFileSync(appPath, 'utf8');
  
  // Cambiar importación del hook
  content = content.replace(
    "import { useMicrosoftGraph } from './hooks/useMicrosoftGraphSimple'",
    "import { useMicrosoftGraph } from './hooks/useMicrosoftGraph'"
  );
  
  // Activar botón de Microsoft
  content = content.replace(
    'onClick={() => alert(\'Microsoft 365 temporalmente deshabilitado. Usa el login normal.\')}',
    'onClick={msLogin}'
  );
  
  content = content.replace(
    'disabled={true}',
    'disabled={msLoading}'
  );
  
  content = content.replace(
    'backgroundColor: \'#9ca3af\'',
    'backgroundColor: \'#0078d4\''
  );
  
  content = content.replace(
    'cursor: \'not-allowed\'',
    'cursor: msLoading ? \'not-allowed\' : \'pointer\''
  );
  
  content = content.replace(
    'opacity: 0.7',
    'opacity: msLoading ? 0.7 : 1'
  );
  
  content = content.replace(
    '⏳ Microsoft 365 (Próximamente)',
    '{msLoading ? \'⏳\' : \'🔐\'} Microsoft 365'
  );
  
  content = content.replace(
    'ℹ️ Usa el login normal por ahora',
    '{isMsAuthenticated && (\n              <div style={{ \n                marginTop: \'10px\', \n                fontSize: \'12px\', \n                color: \'#10b981\' \n              }}>\n                ✅ Conectado con Microsoft\n              </div>\n            )}'
  );
  
  // Activar funciones de SharePoint
  content = content.replace(
    '// Simular URLs para desarrollo (SharePoint deshabilitado temporalmente)',
    'try {\n      if (isMsAuthenticated && msUploadMultipleFiles) {\n        // Subir archivos reales a SharePoint\n        const urls = await msUploadMultipleFiles(archivosFactura, `Facturas/${solicitudId}`)\n        console.log(\'✅ Archivos de factura subidos a SharePoint:\', urls)\n        return urls\n      } else {\n        // Fallback: simular URLs para desarrollo'
  );
  
  content = content.replace(
    'console.log(\'📁 Archivos de factura preparados (URLs simuladas):\', urls)',
    'console.log(\'⚠️ SharePoint no configurado, usando URLs simuladas:\', urls)\n        return urls\n      }\n    } catch (error) {\n      console.error(\'❌ Error al subir archivos de factura:\', error)\n      return []\n    }'
  );
  
  // Activar función de evidencias
  content = content.replace(
    '// Simular URLs para desarrollo (SharePoint deshabilitado temporalmente)',
    'try {\n      if (isMsAuthenticated && msUploadMultipleFiles) {\n        // Subir archivos reales a SharePoint\n        const urls = await msUploadMultipleFiles(archivos, `EvidenciasPago/${solicitudId}`)\n        console.log(\'✅ Archivos de evidencia subidos a SharePoint:\', urls)\n        return urls\n      } else {\n        // Fallback: simular URLs para desarrollo'
  );
  
  content = content.replace(
    'console.log(\'📁 Archivos de evidencia preparados (URLs simuladas):\', urls)',
    'console.log(\'⚠️ SharePoint no configurado, usando URLs simuladas:\', urls)\n        return urls\n      }\n    } catch (error) {\n      console.error(\'❌ Error al subir archivos de evidencia:\', error)\n      return []\n    }'
  );
  
  fs.writeFileSync(appPath, content);
  console.log('✅ App.tsx actualizado para usar SharePoint real');
}

// Función para verificar configuración
function verificarConfiguracion() {
  console.log('\n2. 🔍 Verificando configuración...');
  
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const variables = [
    'VITE_REACT_APP_AZURE_CLIENT_ID',
    'VITE_REACT_APP_AZURE_AUTHORITY',
    'VITE_REACT_APP_SHAREPOINT_SITE_ID'
  ];
  
  let todasPresentes = true;
  variables.forEach(variable => {
    if (envContent.includes(variable)) {
      console.log(`✅ ${variable}: Configurada`);
    } else {
      console.log(`❌ ${variable}: Faltante`);
      todasPresentes = false;
    }
  });
  
  return todasPresentes;
}

// Función principal
function main() {
  try {
    const configOk = verificarConfiguracion();
    
    if (configOk) {
      activarSharePoint();
      
      console.log('\n🎉 ¡SHAREPOINT ACTIVADO!');
      console.log('\n🚀 PRÓXIMOS PASOS:');
      console.log('1. Configurar permisos en Azure AD');
      console.log('2. Crear estructura de carpetas en SharePoint');
      console.log('3. Ejecutar: npm run dev');
      console.log('4. Probar login con Microsoft 365');
      console.log('5. Crear solicitud con archivos');
      
      console.log('\n⚠️ IMPORTANTE:');
      console.log('- Asegúrate de que los permisos estén configurados en Azure AD');
      console.log('- Verifica que la estructura de carpetas exista en SharePoint');
      console.log('- Revisa la consola del navegador para errores');
    } else {
      console.log('\n❌ CONFIGURACIÓN INCOMPLETA');
      console.log('Configura las variables de entorno primero');
    }
    
  } catch (error) {
    console.error('❌ Error al activar SharePoint:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { activarSharePoint, verificarConfiguracion };
