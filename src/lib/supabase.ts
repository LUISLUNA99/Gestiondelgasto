import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Servicios de centros de costo
export const centrosCostoService = {
  // Obtener todos los centros de costo activos
  async getCentrosCosto() {
    try {
      const { data, error } = await supabase
        .from('centros_costo')
        .select('codigo, nombre_actual, cliente, tipo_proyecto')
        .eq('activo', true)
        .order('codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener centros de costo:', error)
      return []
    }
  }
}

// Servicios de clasificaciones
export const clasificacionesService = {
  // Obtener clasificaciones iniciales
  async getClasificacionesIniciales() {
    try {
      const { data, error } = await supabase
        .from('clasificaciones_iniciales')
        .select('codigo, nombre')
        .eq('activo', true)
        .order('codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener clasificaciones iniciales:', error)
      return []
    }
  },

  // Obtener clasificaciones de finanzas
  async getClasificacionesFinanzas() {
    try {
      const { data, error } = await supabase
        .from('clasificaciones_finanzas')
        .select('codigo, nombre')
        .eq('activo', true)
        .order('codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener clasificaciones de finanzas:', error)
      return []
    }
  }
}

// Servicios de empresas generadoras
export const empresasGeneradorasService = {
  // Obtener todas las empresas generadoras activas
  async getEmpresasGeneradoras() {
    try {
      const { data, error } = await supabase
        .from('empresas_generadoras')
        .select('codigo, nombre')
        .eq('activo', true)
        .order('codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener empresas generadoras:', error)
      return []
    }
  }
}

// Servicios de proveedores
export const proveedoresService = {
  // Obtener todos los proveedores activos
  async getProveedores() {
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .select('codigo, nombre, rfc')
        .eq('activo', true)
        .order('codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener proveedores:', error)
      return []
    }
  }
}

// Servicios de cuentas contables
export const cuentasContablesService = {
  // Obtener todas las cuentas contables activas
  async getCuentasContables() {
    try {
      const { data, error } = await supabase
        .from('cuentas_contables')
        .select('codigo, nombre, empresa')
        .eq('activo', true)
        .order('empresa, codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener cuentas contables:', error)
      return []
    }
  },

  // Obtener cuentas contables por empresa
  async getCuentasContablesByEmpresa(empresa: string) {
    try {
      const { data, error } = await supabase
        .from('cuentas_contables')
        .select('codigo, nombre, empresa')
        .eq('activo', true)
        .eq('empresa', empresa)
        .order('codigo')
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener cuentas contables por empresa:', error)
      return []
    }
  }
}

// Servicios de autenticación
export const authService = {
  // Iniciar sesión con email y contraseña
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

// Tipos de la base de datos
export interface Gasto {
  id: string
  descripcion: string
  monto: number
  categoria: string
  fecha: string
  created_at?: string
  updated_at?: string
}

export interface Categoria {
  id: string
  nombre: string
  descripcion?: string
  created_at?: string
}

// Tipos para Solicitud de Compra
export interface SolicitudCompra {
  id: string
  folio: string
  fecha_solicitud: string
  solicitante: string
  departamento: string
  centro_costo: string
  proyecto: string
  justificacion: string
  clasificacion_inicial: string
  clasificacion_finanzas: string
  mes_servicio: string
  mes_pago: string
  empresa_generadora: string
  empresa_pagadora: string
  proveedor: string
  codigo_contable: string
  monto_estimado: number
  moneda: string
  observaciones: string
  status_aprobacion: string
  created_at?: string
  updated_at?: string
}

// Catálogos
export interface ClasificacionInicial {
  id: string
  nombre: string
  created_at?: string
}

export interface ClasificacionFinanzas {
  id: string
  nombre: string
  created_at?: string
}

export interface MesServicio {
  id: string
  nombre: string
  created_at?: string
}

export interface MesPago {
  id: string
  nombre: string
  created_at?: string
}

export interface EmpresaGeneradora {
  id: string
  nombre: string
  created_at?: string
}

export interface EmpresaPagadora {
  id: string
  nombre: string
  created_at?: string
}

export interface Proveedor {
  id: string
  nombre: string
  created_at?: string
}

export interface CentroCosto {
  id: string
  nombre: string
  created_at?: string
}

export interface CodigoContable {
  id: string
  nombre: string
  created_at?: string
}

export interface StatusAprobacion {
  id: string
  nombre: string
  created_at?: string
}

// Funciones para gastos
export const gastosService = {
  // Obtener todos los gastos
  async getGastos(): Promise<Gasto[]> {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false })
    
    if (error) {
      console.error('Error al obtener gastos:', error)
      return []
    }
    
    return data || []
  },

  // Crear un nuevo gasto
  async createGasto(gasto: Omit<Gasto, 'id' | 'created_at' | 'updated_at'>): Promise<Gasto | null> {
    const { data, error } = await supabase
      .from('gastos')
      .insert([gasto])
      .select()
      .single()
    
    if (error) {
      console.error('Error al crear gasto:', error)
      return null
    }
    
    return data
  },

  // Actualizar un gasto
  async updateGasto(id: string, gasto: Partial<Gasto>): Promise<Gasto | null> {
    const { data, error } = await supabase
      .from('gastos')
      .update(gasto)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error al actualizar gasto:', error)
      return null
    }
    
    return data
  },

  // Eliminar un gasto
  async deleteGasto(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error al eliminar gasto:', error)
      return false
    }
    
    return true
  }
}

// Funciones para categorías
export const categoriasService = {
  // Obtener todas las categorías
  async getCategorias(): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre')
    
    if (error) {
      console.error('Error al obtener categorías:', error)
      return []
    }
    
    return data || []
  }
}