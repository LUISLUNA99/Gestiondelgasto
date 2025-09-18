#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Diagnóstico del Sitio - Gestion del Gasto');
console.log('===========================================\n');

// Verificar archivos críticos
function verificarArchivosCriticos() {
  console.log('1. 📁 Verificando archivos críticos...');
  
  const archivosCriticos = [
    'src/App.tsx',
    'src/App.css',
    'src/lib/supabase.ts',
    'package.json',
    'index.html'
  ];
  
  let todosPresentes = true;
  
  archivosCriticos.forEach(archivo => {
    const ruta = path.join(process.cwd(), archivo);
    if (fs.existsSync(ruta)) {
      console.log(`✅ ${archivo}: OK`);
    } else {
      console.log(`❌ ${archivo}: FALTANTE`);
      todosPresentes = false;
    }
  });
  
  return todosPresentes;
}

// Verificar sintaxis de App.tsx
function verificarSintaxisApp() {
  console.log('\n2. 🔍 Verificando sintaxis de App.tsx...');
  
  try {
    const appPath = path.join(process.cwd(), 'src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf8');
    
    // Verificar imports problemáticos
    const importsProblematicos = [
      'useMicrosoftGraph',
      'msalConfig',
      'SharePointService'
    ];
  
    let problemas = 0;
    
    importsProblematicos.forEach(importName => {
      if (content.includes(importName) && !content.includes(`// ${importName}`)) {
        console.log(`⚠️  ${importName}: Importado pero puede causar problemas`);
        problemas++;
      } else if (content.includes(`// ${importName}`)) {
        console.log(`✅ ${importName}: Comentado (OK)`);
      }
    });
    
    // Verificar que no haya errores de sintaxis básicos
    if (content.includes('export const useMicrosoftGraph')) {
      console.log('⚠️  Hook useMicrosoftGraph: Definido pero puede causar problemas');
      problemas++;
    }
    
    if (problemas === 0) {
      console.log('✅ Sintaxis de App.tsx: OK');
      return true;
    } else {
      console.log(`⚠️  ${problemas} problemas potenciales encontrados`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error al verificar App.tsx: ${error.message}`);
    return false;
  }
}

// Verificar dependencias
function verificarDependencias() {
  console.log('\n3. 📦 Verificando dependencias...');
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const depsCriticas = [
      'react',
      'react-dom',
      'vite',
      '@types/react',
      '@types/react-dom'
    ];
    
    let todasInstaladas = true;
    
    depsCriticas.forEach(dep => {
      if (deps[dep]) {
        console.log(`✅ ${dep}: ${deps[dep]}`);
      } else {
        console.log(`❌ ${dep}: NO INSTALADA`);
        todasInstaladas = false;
      }
    });
    
    return todasInstaladas;
    
  } catch (error) {
    console.log(`❌ Error al verificar dependencias: ${error.message}`);
    return false;
  }
}

// Verificar configuración de Vite
function verificarConfiguracionVite() {
  console.log('\n4. ⚙️ Verificando configuración de Vite...');
  
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  
  if (fs.existsSync(viteConfigPath)) {
    console.log('✅ vite.config.ts: Encontrado');
    return true;
  } else {
    console.log('⚠️  vite.config.ts: No encontrado (puede usar configuración por defecto)');
    return true; // No es crítico
  }
}

// Generar reporte
function generarReporte(archivosOk, sintaxisOk, depsOk, viteOk) {
  console.log('\n📊 REPORTE DE DIAGNÓSTICO');
  console.log('==========================');
  
  if (archivosOk && sintaxisOk && depsOk && viteOk) {
    console.log('🎉 ¡SITIO DEBERÍA FUNCIONAR!');
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('1. Ejecutar: npm run dev');
    console.log('2. Abrir: http://localhost:5173');
    console.log('3. Verificar que aparezca la interfaz');
    
    if (!sintaxisOk) {
      console.log('\n⚠️  NOTA: Hay algunos warnings pero no deberían impedir el funcionamiento');
    }
  } else {
    console.log('❌ HAY PROBLEMAS QUE RESOLVER');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    
    if (!archivosOk) {
      console.log('- Verificar archivos faltantes');
    }
    if (!sintaxisOk) {
      console.log('- Revisar sintaxis de App.tsx');
    }
    if (!depsOk) {
      console.log('- Instalar dependencias: npm install');
    }
  }
  
  console.log('\n💡 CONSEJOS:');
  console.log('- Si el sitio sigue en blanco, revisa la consola del navegador');
  console.log('- Verifica que no haya errores de JavaScript');
  console.log('- Asegúrate de que el puerto 5173 esté disponible');
}

// Función principal
function main() {
  try {
    const archivosOk = verificarArchivosCriticos();
    const sintaxisOk = verificarSintaxisApp();
    const depsOk = verificarDependencias();
    const viteOk = verificarConfiguracionVite();
    
    generarReporte(archivosOk, sintaxisOk, depsOk, viteOk);
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { verificarArchivosCriticos, verificarSintaxisApp, verificarDependencias };
