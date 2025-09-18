#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Script de Prueba - Integración SharePoint');
console.log('============================================\n');

// Verificar archivo .env.local
function verificarConfiguracion() {
  console.log('1. 🔍 Verificando configuración...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'REACT_APP_AZURE_CLIENT_ID',
    'REACT_APP_AZURE_AUTHORITY',
    'REACT_APP_SHAREPOINT_SITE_ID'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName}: Configurado`);
    } else {
      console.log(`❌ ${varName}: No encontrado`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Verificar dependencias
function verificarDependencias() {
  console.log('\n2. 📦 Verificando dependencias...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json no encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    '@azure/msal-browser',
    '@azure/msal-react',
    '@microsoft/microsoft-graph-client'
  ];
  
  let allInstalled = true;
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep}: ${dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: No instalado`);
      allInstalled = false;
    }
  });
  
  return allInstalled;
}

// Verificar archivos de código
function verificarArchivosCodigo() {
  console.log('\n3. 📁 Verificando archivos de código...');
  
  const archivosRequeridos = [
    'src/lib/msalConfig.ts',
    'src/lib/sharePointService.ts',
    'src/hooks/useMicrosoftGraph.ts'
  ];
  
  let todosPresentes = true;
  
  archivosRequeridos.forEach(archivo => {
    const ruta = path.join(process.cwd(), archivo);
    if (fs.existsSync(ruta)) {
      console.log(`✅ ${archivo}: Encontrado`);
    } else {
      console.log(`❌ ${archivo}: No encontrado`);
      todosPresentes = false;
    }
  });
  
  return todosPresentes;
}

// Generar reporte de estado
function generarReporte(confOk, depsOk, archivosOk) {
  console.log('\n📊 REPORTE DE ESTADO');
  console.log('===================');
  
  if (confOk && depsOk && archivosOk) {
    console.log('🎉 ¡TODO LISTO! La integración con SharePoint está configurada correctamente.');
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('1. Verificar permisos en Azure AD (verificar-permisos-azure.md)');
    console.log('2. Crear estructura de carpetas en SharePoint (verificacion-carpetas.md)');
    console.log('3. Ejecutar: npm run dev');
    console.log('4. Probar autenticación y subida de archivos');
  } else {
    console.log('⚠️  Hay problemas que resolver antes de continuar.');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    
    if (!confOk) {
      console.log('- Verificar archivo .env.local');
    }
    if (!depsOk) {
      console.log('- Instalar dependencias: npm install');
    }
    if (!archivosOk) {
      console.log('- Verificar archivos de código');
    }
  }
  
  console.log('\n📚 DOCUMENTACIÓN DISPONIBLE:');
  console.log('- GUIA_SHAREPOINT_OFFICE365.md: Guía completa');
  console.log('- verificar-permisos-azure.md: Verificación de permisos');
  console.log('- verificacion-carpetas.md: Estructura de carpetas');
}

// Función principal
function main() {
  try {
    const confOk = verificarConfiguracion();
    const depsOk = verificarDependencias();
    const archivosOk = verificarArchivosCodigo();
    
    generarReporte(confOk, depsOk, archivosOk);
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { verificarConfiguracion, verificarDependencias, verificarArchivosCodigo };
