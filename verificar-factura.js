#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarFacturas() {
  console.log('🔍 Verificando facturas en la base de datos...\n');
  
  try {
    // Consultar solicitudes con facturas
    const { data: solicitudes, error } = await supabase
      .from('solicitudes_compra')
      .select('id, folio, solicitante, factura_url, status_factura, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error al consultar solicitudes:', error);
      return;
    }
    
    console.log('📋 ÚLTIMAS 10 SOLICITUDES:');
    console.log('==========================');
    
    solicitudes.forEach((solicitud, index) => {
      console.log(`\n${index + 1}. Folio: ${solicitud.folio}`);
      console.log(`   Solicitante: ${solicitud.solicitante}`);
      console.log(`   Fecha: ${new Date(solicitud.created_at).toLocaleString()}`);
      console.log(`   Estado Factura: ${solicitud.status_factura || 'Pendiente'}`);
      
      if (solicitud.factura_url) {
        console.log(`   ✅ Factura URL: ${solicitud.factura_url}`);
        
        // Verificar si la URL es válida
        if (solicitud.factura_url.includes('supabase')) {
          console.log(`   📁 Archivo: ${solicitud.factura_url.split('/').pop()}`);
        }
      } else {
        console.log(`   ❌ Sin factura adjunta`);
      }
    });
    
    // Estadísticas
    const conFactura = solicitudes.filter(s => s.factura_url).length;
    const sinFactura = solicitudes.length - conFactura;
    
    console.log('\n📊 ESTADÍSTICAS:');
    console.log('================');
    console.log(`Total solicitudes: ${solicitudes.length}`);
    console.log(`Con factura: ${conFactura}`);
    console.log(`Sin factura: ${sinFactura}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
verificarFacturas();
