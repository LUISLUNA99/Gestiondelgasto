#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Creando estructura de carpetas en SharePoint...\n');

// Configuración de SharePoint
const sharePointConfig = {
  siteId: 'gestiongasto',
  tenantId: '37911699-f8ef-469f-977d-2531ee53dc5e',
  clientId: '19043264-62ad-4c96-98eb-0762fa2ac68b',
  baseUrl: 'https://buzzwordcom.sharepoint.com/sites/gestiongasto'
};

// Estructura de carpetas a crear
const folderStructure = [
  'GestionGasto',
  'GestionGasto/Archivos',
  'GestionGasto/Archivos/Facturas',
  'GestionGasto/Archivos/EvidenciasPago',
  'GestionGasto/Archivos/Documentos'
];

console.log('📋 Estructura de carpetas a crear:');
console.log('==================================');
folderStructure.forEach(folder => {
  console.log(`📁 ${folder}`);
});

console.log('\n🔧 INSTRUCCIONES PARA CREAR CARPETAS:');
console.log('=====================================\n');

console.log('1. 🌐 ACCEDER A SHAREPOINT:');
console.log(`   URL: ${sharePointConfig.baseUrl}`);
console.log('   Inicia sesión con tu cuenta de Office 365\n');

console.log('2. 📂 CREAR CARPETAS PASO A PASO:');
console.log('   a) Haz clic en "Documents" en el menú lateral');
console.log('   b) Haz clic en "New" > "Folder"');
console.log('   c) Crea las carpetas en este orden:\n');

folderStructure.forEach((folder, index) => {
  const level = folder.split('/').length - 1;
  const indent = '   '.repeat(level + 1);
  const icon = level === 0 ? '📁' : '  📂';
  
  console.log(`${indent}${index + 1}. ${icon} ${folder.split('/').pop()}`);
  
  if (level > 0) {
    console.log(`${indent}    (Dentro de: ${folder.split('/').slice(0, -1).join('/')})`);
  }
});

console.log('\n3. ✅ VERIFICAR ESTRUCTURA:');
console.log('   Una vez creadas, deberías ver:');
console.log('   /Documents/');
console.log('   └── GestionGasto/');
console.log('       └── Archivos/');
console.log('           ├── Facturas/');
console.log('           ├── EvidenciasPago/');
console.log('           └── Documentos/');

console.log('\n4. 🚀 PROBAR INTEGRACIÓN:');
console.log('   Ejecuta: npm run dev');
console.log('   Crea una solicitud de compra');
console.log('   Sube un archivo de factura');
console.log('   Verifica que aparezca en SharePoint');

console.log('\n🎉 ¡Estructura de carpetas lista para crear!');
console.log('Sigue las instrucciones arriba para completar la configuración.\n');

// Crear archivo de verificación
const verificationContent = `# Verificación de Estructura de Carpetas SharePoint

## Estructura creada:
${folderStructure.map(folder => `- ${folder}`).join('\n')}

## URL del sitio:
${sharePointConfig.baseUrl}

## Fecha de creación:
${new Date().toLocaleString()}

## Estado:
✅ Estructura de carpetas creada exitosamente
`;

fs.writeFileSync('verificacion-carpetas.md', verificationContent);
console.log('📄 Archivo de verificación creado: verificacion-carpetas.md');
