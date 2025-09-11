import React, { useState } from 'react'
import { X, Save, Calendar } from 'lucide-react'
import { Gasto } from '../lib/supabase'

// Tipo temporal para Categoria
interface Categoria {
  id: string
  nombre: string
  color: string
  icono: string
  created_at: string
}

interface GastoFormProps {
  categorias: Categoria[]
  onGuardar: (gasto: Omit<Gasto, 'id' | 'created_at' | 'updated_at'>) => void
  onCancelar: () => void
}

const GastoForm: React.FC<GastoFormProps> = ({ categorias, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
    usuario_id: 'demo-user' // Para demo, en producción usar auth.uid()
  })

  const [errores, setErrores] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida'
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      nuevosErrores.monto = 'El monto debe ser mayor a 0'
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'La categoría es requerida'
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    onGuardar({
      descripcion: formData.descripcion.trim(),
      monto: parseFloat(formData.monto),
      categoria: formData.categoria,
      fecha: formData.fecha,
      usuario_id: formData.usuario_id
    })
  }

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Gasto</h2>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`input ${errores.descripcion ? 'input-error' : ''}`}
              rows={3}
              placeholder="Describe tu gasto..."
            />
            {errores.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errores.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  className={`input pl-8 ${errores.monto ? 'input-error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errores.monto && (
                <p className="mt-1 text-sm text-red-600">{errores.monto}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={`input ${errores.categoria ? 'input-error' : ''}`}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errores.categoria && (
                <p className="mt-1 text-sm text-red-600">{errores.categoria}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className={`input pl-10 ${errores.fecha ? 'input-error' : ''}`}
              />
            </div>
            {errores.fecha && (
              <p className="mt-1 text-sm text-red-600">{errores.fecha}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancelar}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GastoForm
