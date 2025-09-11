import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
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

// Tipos para Solicitudes de Compra
export interface ClasificacionInicial {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

export interface ClasificacionFinanzas {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

export interface MesServicio {
  id: string
  nombre: string
  codigo: string
  activo: boolean
  created_at: string
}

export interface MesPago {
  id: string
  nombre: string
  codigo: string
  activo: boolean
  created_at: string
}

export interface EmpresaGeneradora {
  id: string
  nombre: string
  codigo?: string
  activo: boolean
  created_at: string
}

export interface EmpresaPagadora {
  id: string
  nombre: string
  codigo?: string
  activo: boolean
  created_at: string
}

export interface Proveedor {
  id: string
  nombre: string
  rfc?: string
  direccion?: string
  telefono?: string
  email?: string
  contacto?: string
  activo: boolean
  created_at: string
}

export interface CentroCosto {
  id: string
  nombre: string
  codigo?: string
  descripcion?: string
  activo: boolean
  created_at: string
}

export interface CodigoContable {
  id: string
  codigo: string
  descripcion: string
  activo: boolean
  created_at: string
}

export interface StatusAprobacion {
  id: string
  nombre: string
  descripcion?: string
  color: string
  orden: number
  activo: boolean
  created_at: string
}

// Solicitud de Compra principal
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
  // Relaciones
  clasificacion_inicial?: ClasificacionInicial
  clasificacion_finanzas?: ClasificacionFinanzas
  mes_servicio?: MesServicio
  mes_pago?: MesPago
  empresa_generadora?: EmpresaGeneradora
  empresa_pagadora?: EmpresaPagadora
  proveedor?: Proveedor
  centro_costo?: CentroCosto
  codigo_contable?: CodigoContable
  status_aprobacion?: StatusAprobacion
}