#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Configurando variables de entorno para SharePoint...\n');

const envContent = `# Configuración de Supabase
VITE_SUPABASE_URL=https://rvwfyfptjqpbumlvbkmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q

# Configuración de SharePoint
VITE_REACT_APP_AZURE_CLIENT_ID=19043264-62ad-4c96-98eb-0762fa2ac68b
VITE_REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/37911699-f8ef-469f-977d-2531ee53dc5e
VITE_REACT_APP_SHAREPOINT_SITE_ID=gestiongasto
VITE_REACT_APP_SHAREPOINT_FOLDER_PATH=/GestionGasto/Archivos`;

try {
  const envPath = path.join(__dirname, '.env.local');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📋 Variables configuradas:');
  console.log('   - VITE_REACT_APP_AZURE_CLIENT_ID');
  console.log('   - VITE_REACT_APP_AZURE_AUTHORITY');
  console.log('   - VITE_REACT_APP_SHAREPOINT_SITE_ID');
  console.log('   - VITE_REACT_APP_SHAREPOINT_FOLDER_PATH');
} catch (error) {
  console.error('❌ Error al crear .env.local:', error.message);
  process.exit(1);
}
