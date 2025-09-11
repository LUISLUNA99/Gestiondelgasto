import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvwfyfptjqpbumlvbkmn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d2Z5ZnB0anFwYnVtbHZia21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU4MjksImV4cCI6MjA3MzExMTgyOX0.cGfA5nq6If8q5SCDDm15LWR2PsVvs4fjDmp2R_YBR1Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos básicos para la base de datos
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
