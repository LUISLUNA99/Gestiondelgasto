import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Gasto {
  id: string
  descripcion: string
  monto: number
  categoria: string
  fecha: string
  usuario_id: string
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  nombre: string
  color: string
  icono: string
  created_at: string
}

export interface SolicitudCompra {
  id: string
  folio: string
  clasificacion_inicial_id?: string
  clasificacion_finanzas_id?: string
  mes_servicio_id?: string
  mes_pago_id?: string
  empresa_generadora_id?: string
  empresa_pagadora_id?: string
  proveedor_id?: string
  centro_costo_id?: string
  codigo_contable_id?: string
  status_aprobacion_id?: string
  concepto_pago?: string
  proyecto?: string
  no_factura?: string
  observaciones_cxp?: string
  observaciones_tesoreria?: string
  importe_me_iva_incluido: number
  importe_sin_iva_mn: number
  iva: number
  importe_mn_iva_incluido: number
  evidencia_factura_pdf?: string
  evidencia_pago_pdf?: string
  solicitante_id: string
  created_at: string
  updated_at: string
}
