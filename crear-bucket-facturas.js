#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function crearBuckets() {
  console.log('🚀 Creando buckets de Supabase Storage...\n');
  
  try {
    // 1. Crear bucket de facturas
    console.log('1. 📁 Creando bucket "facturas"...');
    const { data: facturaData, error: facturaError } = await supabase.storage
      .createBucket('facturas', {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 10485760 // 10MB
      });
    
    if (facturaError) {
      console.error('❌ Error al crear bucket facturas:', facturaError);
    } else {
      console.log('✅ Bucket "facturas" creado exitosamente');
    }
    
    // 2. Crear bucket de evidencias de pago
    console.log('\n2. 📁 Creando bucket "evidencias-pago"...');
    const { data: evidenciaData, error: evidenciaError } = await supabase.storage
      .createBucket('evidencias-pago', {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 10485760 // 10MB
      });
    
    if (evidenciaError) {
      console.error('❌ Error al crear bucket evidencias-pago:', evidenciaError);
    } else {
      console.log('✅ Bucket "evidencias-pago" creado exitosamente');
    }
    
    // 3. Verificar buckets creados
    console.log('\n3. 🔍 Verificando buckets creados...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error al listar buckets:', bucketsError);
    } else {
      console.log('📋 Buckets disponibles:');
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'Público' : 'Privado'})`);
      });
    }
    
    // 4. Probar subida de archivo
    console.log('\n4. 🧪 Probando subida de archivo...');
    const testContent = 'Archivo de prueba para verificar funcionalidad';
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
    
    console.log('\n🎉 ¡Configuración de buckets completada!');
    console.log('Ahora puedes subir facturas en el formulario de solicitudes.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar creación de buckets
crearBuckets();
