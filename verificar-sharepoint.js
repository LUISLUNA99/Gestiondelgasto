#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando configuración de SharePoint...\n');

// Verificar archivo .env.local
function verificarEnv() {
  console.log('1. 📁 Verificando archivo .env.local...');
  
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const variables = [
    'VITE_REACT_APP_AZURE_CLIENT_ID',
    'VITE_REACT_APP_AZURE_AUTHORITY',
    'VITE_REACT_APP_SHAREPOINT_SITE_ID',
    'VITE_REACT_APP_SHAREPOINT_FOLDER_PATH'
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

// Verificar dependencias
function verificarDependencias() {
  console.log('\n2. 📦 Verificando dependencias...');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json no encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const depsSharePoint = [
    '@azure/msal-browser',
    '@azure/msal-react',
    '@microsoft/microsoft-graph-client'
  ];
  
  let todasInstaladas = true;
  depsSharePoint.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`❌ ${dep}: NO INSTALADA`);
      todasInstaladas = false;
    }
  });
  
  return todasInstaladas;
}

// Verificar archivos de configuración
function verificarArchivos() {
  console.log('\n3. 🔧 Verificando archivos de configuración...');
  
  const archivos = [
    'src/lib/msalConfig.ts',
    'src/lib/sharePointService.ts',
    'src/hooks/useMicrosoftGraph.ts'
  ];
  
  let todosPresentes = true;
  archivos.forEach(archivo => {
    const ruta = path.join(__dirname, archivo);
    if (fs.existsSync(ruta)) {
      console.log(`✅ ${archivo}: Encontrado`);
    } else {
      console.log(`❌ ${archivo}: FALTANTE`);
      todosPresentes = false;
    }
  });
  
  return todosPresentes;
}

// Verificar integración en App.tsx
function verificarIntegracion() {
  console.log('\n4. 🔗 Verificando integración en App.tsx...');
  
  const appPath = path.join(__dirname, 'src/App.tsx');
  if (!fs.existsSync(appPath)) {
    console.log('❌ src/App.tsx no encontrado');
    return false;
  }
  
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  const elementos = [
    'useMicrosoftGraph',
    'isMsAuthenticated',
    'msUploadMultipleFiles',
    'msLogin'
  ];
  
  let todosPresentes = true;
  elementos.forEach(elemento => {
    if (appContent.includes(elemento)) {
      console.log(`✅ ${elemento}: Integrado`);
    } else {
      console.log(`❌ ${elemento}: NO INTEGRADO`);
      todosPresentes = false;
    }
  });
  
  return todosPresentes;
}

// Generar reporte
function generarReporte(envOk, depsOk, archivosOk, integracionOk) {
  console.log('\n📊 REPORTE DE CONFIGURACIÓN');
  console.log('============================');
  
  if (envOk && depsOk && archivosOk && integracionOk) {
    console.log('🎉 ¡CONFIGURACIÓN COMPLETA!');
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('1. Ejecutar: npm run dev');
    console.log('2. Abrir: http://localhost:5176');
    console.log('3. Hacer clic en "Microsoft 365" para autenticarse');
    console.log('4. Crear una solicitud con archivos de factura');
    console.log('5. Verificar que se suban a SharePoint');
    
    console.log('\n⚠️  IMPORTANTE:');
    console.log('- Asegúrate de que los permisos estén configurados en Azure AD');
    console.log('- Verifica que la estructura de carpetas exista en SharePoint');
    console.log('- Revisa la consola del navegador para errores');
  } else {
    console.log('❌ CONFIGURACIÓN INCOMPLETA');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    
    if (!envOk) {
      console.log('- Configurar variables de entorno en .env.local');
    }
    if (!depsOk) {
      console.log('- Instalar dependencias: npm install');
    }
    if (!archivosOk) {
      console.log('- Verificar archivos de configuración');
    }
    if (!integracionOk) {
      console.log('- Verificar integración en App.tsx');
    }
  }
  
  console.log('\n💡 CONSEJOS:');
  console.log('- Si hay errores de autenticación, revisa los permisos en Azure AD');
  console.log('- Si no se suben archivos, verifica la estructura de SharePoint');
  console.log('- Usa la consola del navegador para debuggear problemas');
}

// Función principal
function main() {
  try {
    const envOk = verificarEnv();
    const depsOk = verificarDependencias();
    const archivosOk = verificarArchivos();
    const integracionOk = verificarIntegracion();
    
    generarReporte(envOk, depsOk, archivosOk, integracionOk);
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { verificarEnv, verificarDependencias, verificarArchivos, verificarIntegracion };
