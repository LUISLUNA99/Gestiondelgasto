#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function probarSharePoint() {
  console.log('🧪 Probando configuración de SharePoint...\n');
  
  try {
    // 1. Verificar solicitudes con facturas
    console.log('1. 📋 Verificando solicitudes con facturas...');
    const { data: solicitudes, error } = await supabase
      .from('solicitudes_compra')
      .select('id, folio, factura_url, status_factura, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Error al consultar solicitudes:', error);
      return;
    }
    
    console.log(`✅ ${solicitudes.length} solicitudes encontradas`);
    
    solicitudes.forEach((solicitud, index) => {
      console.log(`\n${index + 1}. Folio: ${solicitud.folio}`);
      console.log(`   Fecha: ${new Date(solicitud.created_at).toLocaleString()}`);
      console.log(`   Estado Factura: ${solicitud.status_factura || 'Pendiente'}`);
      
      if (solicitud.factura_url) {
        console.log(`   ✅ Factura URL: ${solicitud.factura_url}`);
        
        // Verificar si es URL de SharePoint
        if (solicitud.factura_url.includes('sharepoint.com')) {
          console.log(`   🎉 ¡URL de SharePoint detectada!`);
        } else {
          console.log(`   ⚠️ URL simulada (no es SharePoint real)`);
        }
      } else {
        console.log(`   ❌ Sin factura adjunta`);
      }
    });
    
    // 2. Estadísticas
    const conFactura = solicitudes.filter(s => s.factura_url).length;
    const conSharePoint = solicitudes.filter(s => s.factura_url && s.factura_url.includes('sharepoint.com')).length;
    
    console.log('\n📊 ESTADÍSTICAS:');
    console.log('================');
    console.log(`Total solicitudes: ${solicitudes.length}`);
    console.log(`Con factura: ${conFactura}`);
    console.log(`Con SharePoint real: ${conSharePoint}`);
    console.log(`Con URLs simuladas: ${conFactura - conSharePoint}`);
    
    // 3. Recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    if (conSharePoint > 0) {
      console.log('🎉 ¡SharePoint está funcionando correctamente!');
      console.log('✅ Los archivos se están subiendo a SharePoint real');
    } else if (conFactura > 0) {
      console.log('⚠️ Hay facturas pero son URLs simuladas');
      console.log('🔧 Necesitas probar el login con Microsoft 365');
    } else {
      console.log('📝 No hay solicitudes con facturas aún');
      console.log('🧪 Crea una solicitud con archivos para probar');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar prueba
probarSharePoint();
