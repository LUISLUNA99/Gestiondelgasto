#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configuración de SharePoint para Gestion del Gasto');
console.log('====================================================\n');

// Función para crear archivo .env.local
function createEnvFile() {
  const envContent = `# Supabase Configuration (ya existente)
VITE_SUPABASE_URL=https://rvwfyfptjqpbumlvbkmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q

# Microsoft Graph Configuration
REACT_APP_AZURE_CLIENT_ID=TU_CLIENT_ID_AQUI
REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/TU_TENANT_ID_AQUI
REACT_APP_REDIRECT_URI=http://localhost:5173

# SharePoint Configuration
REACT_APP_SHAREPOINT_SITE_ID=TU_SITE_ID_AQUI
REACT_APP_SHAREPOINT_DRIVE_ID=
REACT_APP_SHAREPOINT_FOLDER_PATH=/GestionGasto/Archivos`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe. Se creará .env.local.backup');
    fs.copyFileSync(envPath, envPath + '.backup');
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
}

// Función para mostrar instrucciones
function showInstructions() {
  console.log('\n📋 INSTRUCCIONES PARA COMPLETAR LA CONFIGURACIÓN:');
  console.log('================================================\n');
  
  console.log('1. 🔐 CONFIGURAR AZURE AD:');
  console.log('   - Ve a https://portal.azure.com');
  console.log('   - Busca "Azure Active Directory"');
  console.log('   - Ve a "App registrations" > "New registration"');
  console.log('   - Name: GestionGasto-SharePoint');
  console.log('   - Redirect URI: http://localhost:5173 (SPA)');
  console.log('   - Copia el Client ID y Tenant ID\n');
  
  console.log('2. 🔑 CONFIGURAR PERMISOS:');
  console.log('   - En tu app, ve a "API permissions"');
  console.log('   - Add permission > Microsoft Graph > Application permissions');
  console.log('   - Agrega: Sites.ReadWrite.All, Files.ReadWrite.All');
  console.log('   - Haz clic en "Grant admin consent"\n');
  
  console.log('3. 📁 CONFIGURAR SHAREPOINT:');
  console.log('   - Ve a https://sharepoint.com');
  console.log('   - Crea un sitio o usa uno existente');
  console.log('   - Copia el Site ID de la URL');
  console.log('   - Crea la estructura: /GestionGasto/Archivos/\n');
  
  console.log('4. ⚙️  ACTUALIZAR .env.local:');
  console.log('   - Reemplaza TU_CLIENT_ID_AQUI con tu Client ID');
  console.log('   - Reemplaza TU_TENANT_ID_AQUI con tu Tenant ID');
  console.log('   - Reemplaza TU_SITE_ID_AQUI con tu Site ID\n');
  
  console.log('5. 🚀 PROBAR LA INTEGRACIÓN:');
  console.log('   - Ejecuta: npm run dev');
  console.log('   - Inicia sesión con tu cuenta de Office 365');
  console.log('   - Prueba subir un archivo\n');
}

// Función principal
function main() {
  try {
    createEnvFile();
    showInstructions();
    
    console.log('🎉 ¡Configuración inicial completada!');
    console.log('Sigue las instrucciones arriba para completar la configuración.\n');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createEnvFile, showInstructions };
