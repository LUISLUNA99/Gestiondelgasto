import React, { useState, useEffect } from 'react'
import { supabase, Gasto } from '../lib/supabase'
import { Plus, TrendingUp, Calendar, Filter } from 'lucide-react'

// Tipo temporal para Categoria
interface Categoria {
  id: string
  nombre: string
  color: string
  icono: string
  created_at: string
}

const Gastos: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Cargar gastos y categorías al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      
      // Cargar categorías
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre')

      if (categoriasError) throw categoriasError
      setCategorias(categoriasData || [])

      // Cargar gastos (usando un usuario temporal para demo)
      const { data: gastosData, error: gastosError } = await supabase
        .from('gastos')
        .select(`
          *,
          categorias: categoria_id (
            id,
            nombre,
            color,
            icono
          )
        `)
        .order('fecha', { ascending: false })

      if (gastosError) throw gastosError
      setGastos(gastosData || [])

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const agregarGasto = async (nuevoGasto: Omit<Gasto, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('gastos')
        .insert([nuevoGasto])
        .select()

      if (error) throw error

      if (data) {
        setGastos([data[0], ...gastos])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error agregando gasto:', error)
    }
  }

  const eliminarGasto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gastos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setGastos(gastos.filter(gasto => gasto.id !== id))
    } catch (error) {
      console.error('Error eliminando gasto:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '48px',
            width: '48px',
            borderBottom: '2px solid #2563eb',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#4b5563' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp style={{ height: '32px', width: '32px', color: '#2563eb' }} />
              <h1 style={{ marginLeft: '8px', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                Gestión de Gastos
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <Plus style={{ height: '16px', width: '16px' }} />
              Nuevo Gasto
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Resumen */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dbeafe' }}>
                <TrendingUp style={{ height: '24px', width: '24px', color: '#2563eb' }} />
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Total Gastos</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>
                  {gastos.length}
                </p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7' }}>
                <Calendar style={{ height: '24px', width: '24px', color: '#16a34a' }} />
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Monto Total</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#16a34a' }}>
                  ${gastos.reduce((sum, gasto) => sum + gasto.monto, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de gastos */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              Lista de Gastos ({gastos.length})
            </h2>
          </div>
          
          {gastos.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <TrendingUp style={{ height: '48px', width: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                No hay gastos registrados
              </h3>
              <p style={{ color: '#6b7280' }}>
                Comienza agregando tu primer gasto usando el botón "Nuevo Gasto"
              </p>
            </div>
          ) : (
            <div>
              {gastos.map((gasto) => (
                <div key={gasto.id} style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827' }}>
                          {gasto.descripcion}
                        </h3>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar style={{ height: '16px', width: '16px' }} />
                          {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            backgroundColor: '#f3f4f6',
                            color: '#374151'
                          }}>
                            {gasto.categoria}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                        ${gasto.monto.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {new Date(gasto.created_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Gastos