#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Diagnóstico de Carga del Sitio');
console.log('=================================\n');

// Verificar si el servidor está corriendo
async function verificarServidor() {
  console.log('1. 🌐 Verificando servidor...');
  
  try {
    const response = await fetch('http://localhost:5176');
    if (response.ok) {
      console.log('✅ Servidor respondiendo correctamente');
      return true;
    } else {
      console.log(`❌ Servidor respondiendo con código: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Servidor no responde:', error.message);
    return false;
  }
}

// Verificar archivos críticos
function verificarArchivos() {
  console.log('\n2. 📁 Verificando archivos críticos...');
  
  const archivos = [
    'src/main.tsx',
    'src/App.tsx',
    'src/App.css',
    'index.html',
    'package.json'
  ];
  
  let todosPresentes = true;
  archivos.forEach(archivo => {
    const ruta = path.join(__dirname, archivo);
    if (fs.existsSync(ruta)) {
      console.log(`✅ ${archivo}: OK`);
    } else {
      console.log(`❌ ${archivo}: FALTANTE`);
      todosPresentes = false;
    }
  });
  
  return todosPresentes;
}

// Verificar sintaxis de TypeScript
function verificarSintaxis() {
  console.log('\n3. 🔍 Verificando sintaxis...');
  
  try {
    const appPath = path.join(__dirname, 'src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf8');
    
    // Verificar imports problemáticos
    const importsProblematicos = [
      'useMicrosoftGraph',
      'isMsAuthenticated',
      'msUploadMultipleFiles'
    ];
    
    let problemas = 0;
    importsProblematicos.forEach(importName => {
      if (content.includes(importName)) {
        console.log(`✅ ${importName}: Encontrado`);
      } else {
        console.log(`❌ ${importName}: NO ENCONTRADO`);
        problemas++;
      }
    });
    
    // Verificar que no haya errores de sintaxis básicos
    if (content.includes('Cannot find name')) {
      console.log('❌ Errores de "Cannot find name" detectados');
      problemas++;
    }
    
    if (problemas === 0) {
      console.log('✅ Sintaxis: OK');
      return true;
    } else {
      console.log(`❌ ${problemas} problemas de sintaxis encontrados`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error al verificar sintaxis: ${error.message}`);
    return false;
  }
}

// Verificar configuración de Vite
function verificarVite() {
  console.log('\n4. ⚙️ Verificando configuración de Vite...');
  
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  
  if (fs.existsSync(viteConfigPath)) {
    console.log('✅ vite.config.ts: Encontrado');
    return true;
  } else {
    console.log('⚠️ vite.config.ts: No encontrado (usando configuración por defecto)');
    return true; // No es crítico
  }
}

// Verificar variables de entorno
function verificarEnv() {
  console.log('\n5. 🔧 Verificando variables de entorno...');
  
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local: No encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const variables = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_REACT_APP_AZURE_CLIENT_ID'
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

// Generar reporte
function generarReporte(servidorOk, archivosOk, sintaxisOk, viteOk, envOk) {
  console.log('\n📊 REPORTE DE DIAGNÓSTICO');
  console.log('==========================');
  
  if (servidorOk && archivosOk && sintaxisOk && viteOk && envOk) {
    console.log('🎉 ¡SITIO DEBERÍA CARGAR CORRECTAMENTE!');
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('1. Abrir: http://localhost:5176');
    console.log('2. Verificar que aparezca la interfaz');
    console.log('3. Revisar consola del navegador para errores');
    
    console.log('\n💡 SI EL SITIO SIGUE SIN CARGAR:');
    console.log('- Abre las herramientas de desarrollador (F12)');
    console.log('- Ve a la pestaña "Console"');
    console.log('- Busca errores en rojo');
    console.log('- Comparte los errores encontrados');
  } else {
    console.log('❌ HAY PROBLEMAS QUE RESOLVER');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    
    if (!servidorOk) {
      console.log('- Verificar que el servidor esté corriendo: npm run dev');
    }
    if (!archivosOk) {
      console.log('- Verificar archivos faltantes');
    }
    if (!sintaxisOk) {
      console.log('- Revisar errores de sintaxis en App.tsx');
    }
    if (!envOk) {
      console.log('- Configurar variables de entorno');
    }
  }
  
  console.log('\n🔍 DIAGNÓSTICO ADICIONAL:');
  console.log('- Revisar la consola del navegador');
  console.log('- Verificar la pestaña "Network" para errores de carga');
  console.log('- Comprobar que no haya errores de JavaScript');
}

// Función principal
async function main() {
  try {
    const servidorOk = await verificarServidor();
    const archivosOk = verificarArchivos();
    const sintaxisOk = verificarSintaxis();
    const viteOk = verificarVite();
    const envOk = verificarEnv();
    
    generarReporte(servidorOk, archivosOk, sintaxisOk, viteOk, envOk);
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { verificarServidor, verificarArchivos, verificarSintaxis, verificarVite, verificarEnv };
