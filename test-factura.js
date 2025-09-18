#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFactura() {
  console.log('🧪 Probando funcionalidad de factura...\n');
  
  try {
    // 1. Verificar si el bucket de facturas existe
    console.log('1. 📁 Verificando bucket de facturas...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error al listar buckets:', bucketsError);
      return;
    }
    
    const facturaBucket = buckets.find(bucket => bucket.name === 'facturas');
    if (facturaBucket) {
      console.log('✅ Bucket "facturas" encontrado');
    } else {
      console.log('❌ Bucket "facturas" NO encontrado');
      console.log('📋 Buckets disponibles:', buckets.map(b => b.name));
    }
    
    // 2. Verificar la estructura de la tabla
    console.log('\n2. 🗃️ Verificando estructura de la tabla...');
    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitudes_compra')
      .select('*')
      .limit(1)
      .single();
    
    if (solicitudError) {
      console.error('❌ Error al consultar tabla:', solicitudError);
      return;
    }
    
    console.log('✅ Tabla consultada exitosamente');
    console.log('📋 Campos disponibles:', Object.keys(solicitud));
    
    // 3. Verificar si hay archivos en el bucket
    if (facturaBucket) {
      console.log('\n3. 📄 Verificando archivos en bucket...');
      const { data: files, error: filesError } = await supabase.storage
        .from('facturas')
        .list();
      
      if (filesError) {
        console.error('❌ Error al listar archivos:', filesError);
      } else {
        console.log(`📊 Archivos encontrados: ${files.length}`);
        files.forEach((file, index) => {
          console.log(`   ${index + 1}. ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
        });
      }
    }
    
    // 4. Crear un archivo de prueba
    console.log('\n4. 🧪 Creando archivo de prueba...');
    const testContent = 'Este es un archivo de prueba para verificar la funcionalidad de facturas';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('facturas')
      .upload(`test-${Date.now()}.txt`, testFile);
    
    if (uploadError) {
      console.error('❌ Error al subir archivo de prueba:', uploadError);
    } else {
      console.log('✅ Archivo de prueba subido exitosamente');
      console.log('📁 Ruta:', uploadData.path);
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('facturas')
        .getPublicUrl(uploadData.path);
      
      console.log('🔗 URL pública:', urlData.publicUrl);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar prueba
testFactura();
