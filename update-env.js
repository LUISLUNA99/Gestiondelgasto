#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Actualizando configuración de SharePoint...\n');

// Configuración con tus datos
const envContent = `# Supabase Configuration (ya existente)
VITE_SUPABASE_URL=https://rvwfyfptjqpbumlvbkmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q

# Microsoft Graph Configuration - CONFIGURADO
REACT_APP_AZURE_CLIENT_ID=19043264-62ad-4c96-98eb-0762fa2ac68b
REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/37911699-f8ef-469f-977d-2531ee53dc5e
REACT_APP_REDIRECT_URI=http://localhost:5173

# SharePoint Configuration - CONFIGURADO
REACT_APP_SHAREPOINT_SITE_ID=gestiongasto
REACT_APP_SHAREPOINT_DRIVE_ID=
REACT_APP_SHAREPOINT_FOLDER_PATH=/GestionGasto/Archivos`;

try {
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Crear backup si existe
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, envPath + '.backup');
    console.log('✅ Backup creado: .env.local.backup');
  }
  
  // Escribir nueva configuración
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local actualizado exitosamente');
  
  console.log('\n📋 CONFIGURACIÓN APLICADA:');
  console.log('========================');
  console.log('Client ID: 19043264-62ad-4c96-98eb-0762fa2ac68b');
  console.log('Tenant ID: 37911699-f8ef-469f-977d-2531ee53dc5e');
  console.log('Site ID: gestiongasto');
  console.log('URL: https://buzzwordcom.sharepoint.com/sites/gestiongasto/');
  
  console.log('\n🚀 PRÓXIMOS PASOS:');
  console.log('==================');
  console.log('1. Verificar permisos en Azure AD');
  console.log('2. Crear estructura de carpetas en SharePoint');
  console.log('3. Ejecutar: npm run dev');
  console.log('4. Probar autenticación y subida de archivos');
  
} catch (error) {
  console.error('❌ Error al actualizar configuración:', error.message);
  process.exit(1);
}
