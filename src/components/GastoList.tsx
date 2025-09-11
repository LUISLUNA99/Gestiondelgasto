import React from 'react'
import { Trash2, Edit, Calendar, DollarSign } from 'lucide-react'
import { Gasto } from '../lib/supabase'

// Tipo temporal para Categoria
interface Categoria {
  id: string
  nombre: string
  color: string
  icono: string
  created_at: string
}

interface GastoListProps {
  gastos: Gasto[]
  categorias: Categoria[]
  onEliminar: (id: string) => void
}

const GastoList: React.FC<GastoListProps> = ({ gastos, categorias, onEliminar }) => {
  const getCategoriaInfo = (categoriaId: string) => {
    return categorias.find(cat => cat.id === categoriaId) || {
      nombre: 'Sin categoría',
      color: '#9CA3AF',
      icono: 'help-circle'
    }
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(monto)
  }

  if (gastos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-gray-500">
          Comienza agregando tu primer gasto usando el botón "Nuevo Gasto"
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Lista de Gastos ({gastos.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {gastos.map((gasto) => {
          const categoria = getCategoriaInfo(gasto.categoria)
          
          return (
            <div key={gasto.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoria.color }}
                    />
                    <h3 className="text-lg font-medium text-gray-900">
                      {gasto.descripcion}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatFecha(gasto.fecha)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${categoria.color}20`,
                          color: categoria.color
                        }}
                      >
                        {categoria.nombre}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-900">
                      {formatMonto(gasto.monto)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(gasto.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {/* TODO: Implementar edición */}}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar gasto"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
                          onEliminar(gasto.id)
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GastoList
