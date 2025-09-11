import React, { useState, useEffect } from 'react'
import { X, Save, Upload, DollarSign, FileText, Building, Calendar } from 'lucide-react'
import { supabase, SolicitudCompra } from '../lib/supabase'

// Tipos temporales para los catálogos
interface ClasificacionInicial {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

interface ClasificacionFinanzas {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

interface MesServicio {
  id: string
  nombre: string
  codigo: string
  activo: boolean
  created_at: string
}

interface MesPago {
  id: string
  nombre: string
  codigo: string
  activo: boolean
  created_at: string
}

interface EmpresaGeneradora {
  id: string
  nombre: string
  codigo?: string
  activo: boolean
  created_at: string
}

interface EmpresaPagadora {
  id: string
  nombre: string
  codigo?: string
  activo: boolean
  created_at: string
}

interface Proveedor {
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

interface CentroCosto {
  id: string
  nombre: string
  codigo?: string
  descripcion?: string
  activo: boolean
  created_at: string
}

interface CodigoContable {
  id: string
  codigo: string
  descripcion: string
  activo: boolean
  created_at: string
}

interface StatusAprobacion {
  id: string
  nombre: string
  descripcion?: string
  color: string
  orden: number
  activo: boolean
  created_at: string
}

interface SolicitudCompraFormProps {
  onGuardar: (solicitud: Omit<SolicitudCompra, 'id' | 'folio' | 'created_at' | 'updated_at'>) => void
  onCancelar: () => void
}

const SolicitudCompraForm: React.FC<SolicitudCompraFormProps> = ({ onGuardar, onCancelar }) => {
  // Estados para los catálogos
  const [catalogos, setCatalogos] = useState({
    clasificacionesIniciales: [] as ClasificacionInicial[],
    clasificacionesFinanzas: [] as ClasificacionFinanzas[],
    mesesServicio: [] as MesServicio[],
    mesesPago: [] as MesPago[],
    empresasGeneradoras: [] as EmpresaGeneradora[],
    empresasPagadoras: [] as EmpresaPagadora[],
    proveedores: [] as Proveedor[],
    centrosCosto: [] as CentroCosto[],
    codigosContables: [] as CodigoContable[],
    statusAprobacion: [] as StatusAprobacion[]
  })

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Campos de catálogos
    clasificacion_inicial_id: '',
    clasificacion_finanzas_id: '',
    mes_servicio_id: '',
    mes_pago_id: '',
    empresa_generadora_id: '',
    empresa_pagadora_id: '',
    proveedor_id: '',
    centro_costo_id: '',
    codigo_contable_id: '',
    status_aprobacion_id: '',
    
    // Campos de texto
    concepto_pago: '',
    proyecto: '',
    no_factura: '',
    observaciones_cxp: '',
    observaciones_tesoreria: '',
    
    // Campos monetarios
    importe_me_iva_incluido: '',
    importe_sin_iva_mn: '',
    iva: '',
    importe_mn_iva_incluido: '',
    
    // Campos de archivos
    evidencia_factura_pdf: '',
    evidencia_pago_pdf: '',
    
    // Metadatos
    solicitante_id: 'demo-user' // Para demo
  })

  const [errores, setErrores] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  // Cargar catálogos al montar el componente
  useEffect(() => {
    cargarCatalogos()
  }, [])

  const cargarCatalogos = async () => {
    try {
      setLoading(true)
      
      const [
        { data: clasificacionesIniciales },
        { data: clasificacionesFinanzas },
        { data: mesesServicio },
        { data: mesesPago },
        { data: empresasGeneradoras },
        { data: empresasPagadoras },
        { data: proveedores },
        { data: centrosCosto },
        { data: codigosContables },
        { data: statusAprobacion }
      ] = await Promise.all([
        supabase.from('clasificaciones_iniciales').select('*').eq('activo', true).order('nombre'),
        supabase.from('clasificaciones_finanzas').select('*').eq('activo', true).order('nombre'),
        supabase.from('meses_servicio').select('*').eq('activo', true).order('orden'),
        supabase.from('meses_pago').select('*').eq('activo', true).order('orden'),
        supabase.from('empresas_generadoras').select('*').eq('activo', true).order('nombre'),
        supabase.from('empresas_pagadoras').select('*').eq('activo', true).order('nombre'),
        supabase.from('proveedores').select('*').eq('activo', true).order('nombre'),
        supabase.from('centros_costo').select('*').eq('activo', true).order('nombre'),
        supabase.from('codigos_contables').select('*').eq('activo', true).order('codigo'),
        supabase.from('status_aprobacion').select('*').eq('activo', true).order('orden')
      ])

      setCatalogos({
        clasificacionesIniciales: clasificacionesIniciales || [],
        clasificacionesFinanzas: clasificacionesFinanzas || [],
        mesesServicio: mesesServicio || [],
        mesesPago: mesesPago || [],
        empresasGeneradoras: empresasGeneradoras || [],
        empresasPagadoras: empresasPagadoras || [],
        proveedores: proveedores || [],
        centrosCosto: centrosCosto || [],
        codigosContables: codigosContables || [],
        statusAprobacion: statusAprobacion || []
      })

    } catch (error) {
      console.error('Error cargando catálogos:', error)
    } finally {
      setLoading(false)
    }
  }

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

    // Validar campos obligatorios de catálogos
    if (!formData.clasificacion_inicial_id) {
      nuevosErrores.clasificacion_inicial_id = 'La clasificación inicial es requerida'
    }
    if (!formData.clasificacion_finanzas_id) {
      nuevosErrores.clasificacion_finanzas_id = 'La clasificación de finanzas es requerida'
    }
    if (!formData.mes_servicio_id) {
      nuevosErrores.mes_servicio_id = 'El mes de servicio es requerido'
    }
    if (!formData.mes_pago_id) {
      nuevosErrores.mes_pago_id = 'El mes de pago es requerido'
    }
    if (!formData.empresa_generadora_id) {
      nuevosErrores.empresa_generadora_id = 'La empresa generadora es requerida'
    }
    if (!formData.empresa_pagadora_id) {
      nuevosErrores.empresa_pagadora_id = 'La empresa pagadora es requerida'
    }
    if (!formData.proveedor_id) {
      nuevosErrores.proveedor_id = 'El proveedor es requerido'
    }
    if (!formData.centro_costo_id) {
      nuevosErrores.centro_costo_id = 'El centro de costo es requerido'
    }
    if (!formData.codigo_contable_id) {
      nuevosErrores.codigo_contable_id = 'El código contable es requerido'
    }

    // Validar campos de texto obligatorios
    if (!formData.concepto_pago?.trim()) {
      nuevosErrores.concepto_pago = 'El concepto del pago es requerido'
    }

    // Validar campos monetarios
    const importeMe = parseFloat(formData.importe_me_iva_incluido)
    const importeSinIva = parseFloat(formData.importe_sin_iva_mn)
    const iva = parseFloat(formData.iva)
    const importeConIva = parseFloat(formData.importe_mn_iva_incluido)

    if (isNaN(importeMe) || importeMe < 0) {
      nuevosErrores.importe_me_iva_incluido = 'El importe en moneda extranjera debe ser un número válido'
    }
    if (isNaN(importeSinIva) || importeSinIva < 0) {
      nuevosErrores.importe_sin_iva_mn = 'El importe sin IVA debe ser un número válido'
    }
    if (isNaN(iva) || iva < 0) {
      nuevosErrores.iva = 'El IVA debe ser un número válido'
    }
    if (isNaN(importeConIva) || importeConIva < 0) {
      nuevosErrores.importe_mn_iva_incluido = 'El importe con IVA debe ser un número válido'
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
      clasificacion_inicial_id: formData.clasificacion_inicial_id,
      clasificacion_finanzas_id: formData.clasificacion_finanzas_id,
      mes_servicio_id: formData.mes_servicio_id,
      mes_pago_id: formData.mes_pago_id,
      empresa_generadora_id: formData.empresa_generadora_id,
      empresa_pagadora_id: formData.empresa_pagadora_id,
      proveedor_id: formData.proveedor_id,
      centro_costo_id: formData.centro_costo_id,
      codigo_contable_id: formData.codigo_contable_id,
      status_aprobacion_id: formData.status_aprobacion_id,
      concepto_pago: formData.concepto_pago,
      proyecto: formData.proyecto,
      no_factura: formData.no_factura,
      observaciones_cxp: formData.observaciones_cxp,
      observaciones_tesoreria: formData.observaciones_tesoreria,
      importe_me_iva_incluido: parseFloat(formData.importe_me_iva_incluido),
      importe_sin_iva_mn: parseFloat(formData.importe_sin_iva_mn),
      iva: parseFloat(formData.iva),
      importe_mn_iva_incluido: parseFloat(formData.importe_mn_iva_incluido),
      evidencia_factura_pdf: formData.evidencia_factura_pdf,
      evidencia_pago_pdf: formData.evidencia_pago_pdf,
      solicitante_id: formData.solicitante_id
    })
  }

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando catálogos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Solicitud de Compra</h2>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección 1: Clasificaciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Clasificaciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clasificación Inicial *
                </label>
                <select
                  name="clasificacion_inicial_id"
                  value={formData.clasificacion_inicial_id}
                  onChange={handleChange}
                  className={`input ${errores.clasificacion_inicial_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona una clasificación</option>
                  {catalogos.clasificacionesIniciales.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.clasificacion_inicial_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.clasificacion_inicial_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clasificación Finanzas *
                </label>
                <select
                  name="clasificacion_finanzas_id"
                  value={formData.clasificacion_finanzas_id}
                  onChange={handleChange}
                  className={`input ${errores.clasificacion_finanzas_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona una clasificación</option>
                  {catalogos.clasificacionesFinanzas.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.clasificacion_finanzas_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.clasificacion_finanzas_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 2: Fechas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas de Servicio y Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes Servicio *
                </label>
                <select
                  name="mes_servicio_id"
                  value={formData.mes_servicio_id}
                  onChange={handleChange}
                  className={`input ${errores.mes_servicio_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona un mes</option>
                  {catalogos.mesesServicio.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.mes_servicio_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.mes_servicio_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes de Pago *
                </label>
                <select
                  name="mes_pago_id"
                  value={formData.mes_pago_id}
                  onChange={handleChange}
                  className={`input ${errores.mes_pago_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona un mes</option>
                  {catalogos.mesesPago.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.mes_pago_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.mes_pago_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 3: Empresas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Empresas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa Generadora del Gasto *
                </label>
                <select
                  name="empresa_generadora_id"
                  value={formData.empresa_generadora_id}
                  onChange={handleChange}
                  className={`input ${errores.empresa_generadora_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona una empresa</option>
                  {catalogos.empresasGeneradoras.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.empresa_generadora_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.empresa_generadora_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa que Paga *
                </label>
                <select
                  name="empresa_pagadora_id"
                  value={formData.empresa_pagadora_id}
                  onChange={handleChange}
                  className={`input ${errores.empresa_pagadora_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona una empresa</option>
                  {catalogos.empresasPagadoras.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.empresa_pagadora_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.empresa_pagadora_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 4: Concepto y Proveedor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Concepto y Proveedor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto del Pago *
                </label>
                <input
                  type="text"
                  name="concepto_pago"
                  value={formData.concepto_pago}
                  onChange={handleChange}
                  className={`input ${errores.concepto_pago ? 'input-error' : ''}`}
                  placeholder="Describe el concepto del pago"
                />
                {errores.concepto_pago && (
                  <p className="mt-1 text-sm text-red-600">{errores.concepto_pago}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  name="proveedor_id"
                  value={formData.proveedor_id}
                  onChange={handleChange}
                  className={`input ${errores.proveedor_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona un proveedor</option>
                  {catalogos.proveedores.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.proveedor_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.proveedor_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 5: Centro de Costo y Proyecto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Centro de Costo y Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Centro de Costo *
                </label>
                <select
                  name="centro_costo_id"
                  value={formData.centro_costo_id}
                  onChange={handleChange}
                  className={`input ${errores.centro_costo_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona un centro de costo</option>
                  {catalogos.centrosCosto.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
                {errores.centro_costo_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.centro_costo_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto
                </label>
                <input
                  type="text"
                  name="proyecto"
                  value={formData.proyecto}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nombre del proyecto"
                />
              </div>
            </div>
          </div>

          {/* Sección 6: Código Contable y Factura */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Contable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Contable *
                </label>
                <select
                  name="codigo_contable_id"
                  value={formData.codigo_contable_id}
                  onChange={handleChange}
                  className={`input ${errores.codigo_contable_id ? 'input-error' : ''}`}
                >
                  <option value="">Selecciona un código</option>
                  {catalogos.codigosContables.map(item => (
                    <option key={item.id} value={item.id}>{item.codigo} - {item.descripcion}</option>
                  ))}
                </select>
                {errores.codigo_contable_id && (
                  <p className="mt-1 text-sm text-red-600">{errores.codigo_contable_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Factura
                </label>
                <input
                  type="text"
                  name="no_factura"
                  value={formData.no_factura}
                  onChange={handleChange}
                  className="input"
                  placeholder="Número de factura"
                />
              </div>
            </div>
          </div>

          {/* Sección 7: Importes Monetarios */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Importes Monetarios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importe M.E. IVA Incluido *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="importe_me_iva_incluido"
                    value={formData.importe_me_iva_incluido}
                    onChange={handleChange}
                    className={`input pl-8 ${errores.importe_me_iva_incluido ? 'input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errores.importe_me_iva_incluido && (
                  <p className="mt-1 text-sm text-red-600">{errores.importe_me_iva_incluido}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importe Sin IVA M.N. *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="importe_sin_iva_mn"
                    value={formData.importe_sin_iva_mn}
                    onChange={handleChange}
                    className={`input pl-8 ${errores.importe_sin_iva_mn ? 'input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errores.importe_sin_iva_mn && (
                  <p className="mt-1 text-sm text-red-600">{errores.importe_sin_iva_mn}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IVA *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="iva"
                    value={formData.iva}
                    onChange={handleChange}
                    className={`input pl-8 ${errores.iva ? 'input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errores.iva && (
                  <p className="mt-1 text-sm text-red-600">{errores.iva}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importe M.N. IVA Incluido *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="importe_mn_iva_incluido"
                    value={formData.importe_mn_iva_incluido}
                    onChange={handleChange}
                    className={`input pl-8 ${errores.importe_mn_iva_incluido ? 'input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errores.importe_mn_iva_incluido && (
                  <p className="mt-1 text-sm text-red-600">{errores.importe_mn_iva_incluido}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección 8: Observaciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones CXP
                </label>
                <textarea
                  name="observaciones_cxp"
                  value={formData.observaciones_cxp}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                  placeholder="Observaciones para cuentas por pagar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones (USO DE TESORERIA)
                </label>
                <textarea
                  name="observaciones_tesoreria"
                  value={formData.observaciones_tesoreria}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                  placeholder="Observaciones para tesorería"
                />
              </div>
            </div>
          </div>

          {/* Sección 9: Archivos Adjuntos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Archivos Adjuntos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidencia PDF de Factura
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="input"
                  onChange={(e) => {
                    // TODO: Implementar subida de archivos
                    console.log('Archivo de factura seleccionado:', e.target.files?.[0])
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidencia PDF de Pago
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="input"
                  onChange={(e) => {
                    // TODO: Implementar subida de archivos
                    console.log('Archivo de pago seleccionado:', e.target.files?.[0])
                  }}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t">
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
              Guardar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SolicitudCompraForm
