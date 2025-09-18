import { useState, useEffect } from 'react'
import { FileText, TrendingUp, Menu, X, LogOut, User } from 'lucide-react'
import './App.css'
import { gastosService, authService, centrosCostoService, clasificacionesService, empresasGeneradorasService, proveedoresService, cuentasContablesService, solicitudesCompraService, type Gasto, supabase } from './lib/supabase'

function App() {
  const [currentPage, setCurrentPage] = useState<'gastos' | 'solicitudes'>('gastos')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Hook de Microsoft Graph (temporalmente deshabilitado)
  // const {
  //   isAuthenticated: isMsAuthenticated,
  //   user: msUser,
  //   login: msLogin,
  //   logout: msLogout,
  //   uploadFile: msUploadFile,
  //   uploadMultipleFiles: msUploadMultipleFiles,
  //   isLoading: msLoading
  // } = useMicrosoftGraph()
  const [loading, setLoading] = useState(true)
  const [loginData, setLoginData] = useState({
    email: 'luis.luna@grupocsi.com',
    password: '987654321'
  })
  const [loginError, setLoginError] = useState('')

  const navigation = [
    { name: 'Gastos', page: 'gastos', icon: TrendingUp },
    { name: 'Solicitudes de Compra', page: 'solicitudes', icon: FileText },
  ]

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await authService.getCurrentUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Función para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (!loginData.email || !loginData.password) {
      setLoginError('Por favor completa todos los campos')
      return
    }

    const { data, error } = await authService.signIn(loginData.email, loginData.password)
    
    if (error) {
      setLoginError('Credenciales incorrectas')
    } else if (data) {
      setUser(data.user)
      setLoginData({ email: '', password: '' })
    }
  }

  // Función para cerrar sesión
  const handleLogout = async () => {
    await authService.signOut()
    setUser(null)
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  // Mostrar login si no hay usuario autenticado
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <User style={{ color: 'white', width: '24px', height: '24px' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0' }}>
              Gestión del Gasto
            </h1>
            <p style={{ color: '#6b7280', margin: '8px 0 0' }}>
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Tu contraseña"
                required
              />
            </div>

            {loginError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        width: '256px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', padding: '0 16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp style={{ height: '32px', width: '32px', color: '#2563eb' }} />
            <h1 style={{ marginLeft: '8px', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              Gestión de Gastos
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X style={{ height: '24px', width: '24px' }} />
          </button>
        </div>
        
        <nav style={{ marginTop: '32px' }}>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentPage(item.page as 'gastos' | 'solicitudes')
                  setSidebarOpen(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  backgroundColor: currentPage === item.page ? '#dbeafe' : 'transparent',
                  color: currentPage === item.page ? '#1d4ed8' : '#4b5563',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon style={{ height: '20px', width: '20px', marginRight: '12px' }} />
                {item.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            backgroundColor: 'rgba(75, 85, 99, 0.75)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div style={{ paddingLeft: '256px' }}>
        {/* Header móvil */}
        <div style={{ display: 'none', backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', padding: '0 16px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Menu style={{ height: '24px', width: '24px' }} />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              {currentPage === 'gastos' ? 'Gastos' : 'Solicitudes de Compra'}
            </h1>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Salir
        </button>
          </div>
        </div>

        {/* Contenido de la página */}
        <main>
          {currentPage === 'gastos' && <GastosPage user={user} />}
          {currentPage === 'solicitudes' && <SolicitudesPage />}
        </main>
      </div>
    </div>
  )
}

// Componente de Gastos con base de datos
function GastosPage({ user }: { user: any }) {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [centrosCosto, setCentrosCosto] = useState<any[]>([])
  const [clasificacionesIniciales, setClasificacionesIniciales] = useState<any[]>([])
  const [clasificacionesFinanzas, setClasificacionesFinanzas] = useState<any[]>([])
  const [empresasGeneradoras, setEmpresasGeneradoras] = useState<any[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [cuentasContables, setCuentasContables] = useState<any[]>([])
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    solicitante: '',
    centro_costo: '',
    proyecto: '',
    clasificacion_inicial: '',
    mes_servicio: '',
    mes_pago: '',
    empresa_generadora: '',
    empresa_pagadora: '',
    codigo_contable: ''
  })

  const [bienes, setBienes] = useState([{
    id: 1,
    cantidad: '',
    descripcion: '',
    monto_estimado: '',
    moneda: 'MXN'
  }])
  
  // Estado para archivos de factura
  const [archivosFactura, setArchivosFactura] = useState<File[]>([])
  
  // Estado para modal de autorización
  const [modalAutorizacion, setModalAutorizacion] = useState({
    abierto: false,
    solicitudId: '',
    accion: '',
    observacion: ''
  })
  
  // Estado para pantalla de detalle
  const [pantallaDetalle, setPantallaDetalle] = useState({
    abierta: false,
    solicitud: null as any
  })
  
  // Estado para modal de finanzas
  const [modalFinanzas, setModalFinanzas] = useState({
    abierto: false,
    solicitudId: '',
    clasificacion: '',
    codigo_contable: '',
    estado_pago: '',
    observaciones: '',
    archivos: [] as File[]
  })
  
  // Estado para modal de factura
  const [modalFactura, setModalFactura] = useState({
    abierto: false,
    solicitudId: '',
    archivos: [] as File[]
  })

  // Actualizar el solicitante cuando cambie el usuario
  useEffect(() => {
    if (user?.email) {
      setNuevaSolicitud(prev => ({
        ...prev,
        solicitante: user.email
      }))
    }
  }, [user])

  // Limpiar código contable cuando cambie la empresa generadora
  useEffect(() => {
    setNuevaSolicitud(prev => ({
      ...prev,
      codigo_contable: ''
    }))
  }, [nuevaSolicitud.empresa_generadora])

  // Funciones para manejar bienes
  const agregarBien = () => {
    const nuevoId = Math.max(...bienes.map(b => b.id), 0) + 1
    setBienes([{
      id: nuevoId,
      cantidad: '',
      descripcion: '',
      monto_estimado: '',
      moneda: 'MXN'
    }, ...bienes])
  }

  const eliminarBien = (id: number) => {
    if (bienes.length > 1) {
      setBienes(bienes.filter(bien => bien.id !== id))
    }
  }
  
  // Función para manejar archivos de factura
  const manejarArchivosFactura = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setArchivosFactura(prev => [...prev, ...files])
  }
  
  // Función para eliminar archivo de factura
  const eliminarArchivoFactura = (index: number) => {
    setArchivosFactura(prev => prev.filter((_, i) => i !== index))
  }
  
  // Función para subir archivos de factura a Supabase Storage
  const subirArchivosFactura = async (solicitudId: string) => {
    if (archivosFactura.length === 0) return []
    
    const urls: string[] = []
    
    for (const archivo of archivosFactura) {
      try {
        const fileName = `factura-${solicitudId}-${Date.now()}-${archivo.name}`
        const { data, error } = await supabase.storage
          .from('evidencias-pago')
          .upload(fileName, archivo)
        
        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('evidencias-pago')
          .getPublicUrl(fileName)
        
        urls.push(publicUrl)
      } catch (error) {
        console.error('Error al subir archivo de factura:', error)
      }
    }
    
    return urls
  }

  const actualizarBien = (id: number, campo: string, valor: string) => {
    setBienes(bienes.map(bien => 
      bien.id === id ? { ...bien, [campo]: valor } : bien
    ))
  }

  const calcularTotal = () => {
    return bienes.reduce((total, bien) => {
      const monto = parseFloat(bien.monto_estimado) || 0
      return total + monto
    }, 0)
  }

  // Funciones para pantalla de detalle
  const abrirPantallaDetalle = (solicitudId: string) => {
    const solicitud = solicitudes.find(s => s.id === solicitudId)
    setPantallaDetalle({
      abierta: true,
      solicitud
    })
  }

  const cerrarPantallaDetalle = () => {
    setPantallaDetalle({
      abierta: false,
      solicitud: null
    })
  }

  // Funciones para autorización
  const abrirModalAutorizacion = (solicitudId: string, accion: string) => {
    setModalAutorizacion({
      abierto: true,
      solicitudId,
      accion,
      observacion: ''
    })
  }

  const cerrarModalAutorizacion = () => {
    setModalAutorizacion({
      abierto: false,
      solicitudId: '',
      accion: '',
      observacion: ''
    })
  }

  const procesarAutorizacion = async () => {
    try {
      const autorizacionData = {
        status: modalAutorizacion.accion,
        autorizado_por: user?.email || 'Usuario',
        observacion: modalAutorizacion.observacion
      }

      await solicitudesCompraService.actualizarAutorizacion(modalAutorizacion.solicitudId, autorizacionData)
      
      // Recargar las solicitudes
      await cargarDatos()
      
      // Cerrar modal de autorización
      cerrarModalAutorizacion()
      
      // Cerrar pantalla de detalle
      cerrarPantallaDetalle()
      
      // Mostrar mensaje de éxito
      alert(`Solicitud ${modalAutorizacion.accion.toLowerCase()} exitosamente`)
      
    } catch (error) {
      console.error('Error al procesar autorización:', error)
      alert('Error al procesar la autorización. Por favor intenta de nuevo.')
    }
  }

  // Funciones para finanzas
  const abrirModalFinanzas = (solicitudId: string) => {
    setModalFinanzas({
      abierto: true,
      solicitudId,
      clasificacion: '',
      codigo_contable: '',
      estado_pago: '',
      observaciones: '',
      archivos: []
    })
  }

  const cerrarModalFinanzas = () => {
    setModalFinanzas({
      abierto: false,
      solicitudId: '',
      clasificacion: '',
      codigo_contable: '',
      estado_pago: '',
      observaciones: '',
      archivos: []
    })
  }

  // Funciones para manejar archivos
  const manejarArchivos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(event.target.files || [])
    setModalFinanzas(prev => ({
      ...prev,
      archivos: [...prev.archivos, ...archivos]
    }))
  }

  const eliminarArchivo = (index: number) => {
    setModalFinanzas(prev => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index)
    }))
  }

  const subirArchivos = async (archivos: File[], solicitudId: string) => {
    const urls: string[] = []
    
    for (const archivo of archivos) {
      try {
        // Crear nombre único para el archivo
        const nombreArchivo = `${solicitudId}_${Date.now()}_${archivo.name}`
        
        // Subir archivo a Supabase Storage
        const { data, error } = await supabase.storage
          .from('evidencias-pago')
          .upload(nombreArchivo, archivo)
        
        if (error) {
          console.error('Error al subir archivo:', error)
          continue
        }
        
        // Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
          .from('evidencias-pago')
          .getPublicUrl(nombreArchivo)
        
        urls.push(urlData.publicUrl)
      } catch (error) {
        console.error('Error al procesar archivo:', error)
      }
    }
    
    return urls
  }

  const procesarFinanzas = async () => {
    try {
      // Subir archivos si hay alguno
      let urlsEvidencia = ''
      
      if (modalFinanzas.archivos.length > 0) {
        const urlsSubidas = await subirArchivos(modalFinanzas.archivos, modalFinanzas.solicitudId)
        urlsEvidencia = urlsSubidas.join(', ')
      }

      const finanzasData = {
        clasificacion: modalFinanzas.clasificacion,
        codigo_contable: modalFinanzas.codigo_contable,
        estado_pago: modalFinanzas.estado_pago,
        evidencia_url: urlsEvidencia,
        observaciones: modalFinanzas.observaciones,
        procesado_por: user?.email || 'Usuario'
      }

      await solicitudesCompraService.actualizarFinanzas(modalFinanzas.solicitudId, finanzasData)
      
      // Recargar las solicitudes
      await cargarDatos()
      
      // Cerrar modal
      cerrarModalFinanzas()
      
      // Mostrar mensaje de éxito
      const mensaje = modalFinanzas.archivos.length > 0 
        ? `Solicitud procesada en finanzas exitosamente. Se subieron ${modalFinanzas.archivos.length} archivo(s).`
        : 'Solicitud procesada en finanzas exitosamente.'
      alert(mensaje)
      
    } catch (error) {
      console.error('Error al procesar finanzas:', error)
      alert('Error al procesar en finanzas. Por favor intenta de nuevo.')
    }
  }
  
  // Función para abrir modal de factura
  const abrirModalFactura = (solicitudId: string) => {
    setModalFactura({
      abierto: true,
      solicitudId,
      archivos: []
    })
  }
  
  // Función para cerrar modal de factura
  const cerrarModalFactura = () => {
    setModalFactura({
      abierto: false,
      solicitudId: '',
      archivos: []
    })
  }
  
  // Función para manejar archivos de factura en el modal
  const manejarArchivosFacturaModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setModalFactura(prev => ({
      ...prev,
      archivos: [...prev.archivos, ...files]
    }))
  }
  
  // Función para eliminar archivo de factura en el modal
  const eliminarArchivoFacturaModal = (index: number) => {
    setModalFactura(prev => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index)
    }))
  }
  
  // Función para subir archivos de factura del modal
  const subirArchivosFacturaModal = async (solicitudId: string) => {
    if (modalFactura.archivos.length === 0) return []
    
    const urls: string[] = []
    
    for (const archivo of modalFactura.archivos) {
      try {
        const fileName = `factura-${solicitudId}-${Date.now()}-${archivo.name}`
        const { data, error } = await supabase.storage
          .from('evidencias-pago')
          .upload(fileName, archivo)
        
        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('evidencias-pago')
          .getPublicUrl(fileName)
        
        urls.push(publicUrl)
      } catch (error) {
        console.error('Error al subir archivo de factura:', error)
      }
    }
    
    return urls
  }
  
  // Función para procesar factura
  const procesarFactura = async () => {
    try {
      // Subir archivos de factura
      const urlsFactura = await subirArchivosFacturaModal(modalFactura.solicitudId)
      
      if (urlsFactura.length > 0) {
        // Actualizar la solicitud con las URLs de factura
        await supabase
          .from('solicitudes_compra')
          .update({ 
            factura_url: urlsFactura.join(','),
            status_factura: 'Completado',
            fecha_factura: new Date().toISOString()
          })
          .eq('id', modalFactura.solicitudId)
      }
      
      // Cerrar modal y recargar datos
      cerrarModalFactura()
      await cargarDatos()
      
      alert('Factura adjuntada exitosamente')
    } catch (error) {
      console.error('Error al adjuntar factura:', error)
      alert('Error al adjuntar factura. Por favor intenta de nuevo.')
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      console.log('🚀 Iniciando carga de datos...')
      const [gastosData, solicitudesData, centrosCostoData, clasifInicialesData, clasifFinanzasData, empresasData, proveedoresData, cuentasData] = await Promise.all([
        gastosService.getGastos(),
        solicitudesCompraService.getSolicitudes(),
        centrosCostoService.getCentrosCosto(),
        clasificacionesService.getClasificacionesIniciales(),
        clasificacionesService.getClasificacionesFinanzas(),
        empresasGeneradorasService.getEmpresasGeneradoras(),
        proveedoresService.getProveedores(),
        cuentasContablesService.getCuentasContables()
      ])
      console.log('✅ Datos cargados exitosamente')
      setGastos(gastosData)
      setSolicitudes(solicitudesData)
      setCentrosCosto(centrosCostoData)
      setClasificacionesIniciales(clasifInicialesData)
      setClasificacionesFinanzas(clasifFinanzasData)
      setEmpresasGeneradoras(empresasData)
      setProveedores(proveedoresData)
      setCuentasContables(cuentasData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const agregarSolicitud = async () => {
    if (nuevaSolicitud.solicitante && bienes.length > 0) {
      try {
        // Generar folio automáticamente basado en timestamp
        const folioGenerado = `SC-${Date.now()}`
        // Generar fecha automáticamente (fecha actual)
        const fechaActual = new Date().toISOString().split('T')[0]
        
        // Preparar datos de la solicitud
        const solicitudData = {
          folio: folioGenerado,
          fecha_solicitud: fechaActual,
          solicitante: nuevaSolicitud.solicitante,
          centro_costo: nuevaSolicitud.centro_costo,
          proyecto: nuevaSolicitud.proyecto,
          clasificacion_inicial: nuevaSolicitud.clasificacion_inicial,
          mes_servicio: nuevaSolicitud.mes_servicio,
          mes_pago: nuevaSolicitud.mes_pago,
          empresa_generadora: nuevaSolicitud.empresa_generadora,
          empresa_pagadora: nuevaSolicitud.empresa_pagadora,
          codigo_contable: nuevaSolicitud.codigo_contable,
          total_estimado: calcularTotal()
        }
        
        // Preparar datos de los bienes
        const bienesData = bienes.map(bien => ({
          cantidad: parseInt(bien.cantidad) || 1,
          descripcion: bien.descripcion,
          monto_estimado: parseFloat(bien.monto_estimado) || 0,
          moneda: bien.moneda
        }))
        
                  // Guardar en la base de datos
                  const resultado = await solicitudesCompraService.crearSolicitud(solicitudData, bienesData)
                  
                  // Subir archivos de factura si existen
                  if (archivosFactura.length > 0) {
                    const urlsFactura = await subirArchivosFactura(resultado.solicitud.id)
                    if (urlsFactura.length > 0) {
                      // Actualizar la solicitud con las URLs de factura
                      await supabase
                        .from('solicitudes_compra')
                        .update({ factura_url: urlsFactura.join(',') })
                        .eq('id', resultado.solicitud.id)
                    }
                  }
                  
                  console.log('Solicitud guardada:', resultado)
        
        // Recargar las solicitudes
        await cargarDatos()
        
        // Mostrar mensaje de éxito
        const totalFormateado = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 2
        }).format(calcularTotal())
        
        alert(`Solicitud de compra creada exitosamente\nFolio: ${folioGenerado}\nFecha: ${fechaActual}\nTotal: ${totalFormateado}`)
        
                  // Resetear formulario
                  setNuevaSolicitud({
                    solicitante: '',
                    centro_costo: '',
                    proyecto: '',
                    clasificacion_inicial: '',
                    mes_servicio: '',
                    mes_pago: '',
                    empresa_generadora: '',
                    empresa_pagadora: '',
                    codigo_contable: ''
                  })
                  setBienes([{
                    id: 1,
                    cantidad: '',
                    descripcion: '',
                    monto_estimado: '',
                    moneda: 'MXN'
                  }])
                  setArchivosFactura([])
                  setShowForm(false)
        
      } catch (error) {
        console.error('Error al crear solicitud:', error)
        alert('Error al crear la solicitud. Por favor intenta de nuevo.')
      }
    }
  }

  const eliminarGasto = async (id: string) => {
    const success = await gastosService.deleteGasto(id)
    if (success) {
      setGastos(gastos.filter(gasto => gasto.id !== id))
    }
  }

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  Usuario
                </span>
              </div>
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Cerrar Sesión
              </button>
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
              <span>+</span>
              Nueva Solicitud de Compra
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
              <p style={{ color: '#6b7280' }}>Cargando gastos...</p>
            </div>
          </div>
        ) : (
          <div>
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
                    <p style={{ fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>{gastos.length}</p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef3c7' }}>
                    <FileText style={{ height: '24px', width: '24px', color: '#f59e0b' }} />
                  </div>
                  <div style={{ marginLeft: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Solicitudes</p>
                    <p style={{ fontSize: '24px', fontWeight: '600', color: '#f59e0b' }}>{solicitudes.length}</p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7' }}>
                    <span style={{ fontSize: '24px' }}>💰</span>
                  </div>
                  <div style={{ marginLeft: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Monto Total</p>
                    <p style={{ fontSize: '24px', fontWeight: '600', color: '#16a34a' }}>
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                      }).format(totalGastos)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de solicitudes */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                  Solicitudes de Compra ({solicitudes.length})
                </h2>
              </div>
              
              {solicitudes.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <FileText style={{ height: '48px', width: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                    No hay solicitudes registradas
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Comienza agregando tu primera solicitud usando el botón "Nueva Solicitud de Compra"
                  </p>
                </div>
              ) : (
                <div>
                  {solicitudes.map((solicitud) => (
                    <div key={solicitud.id} style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827' }}>
                              {solicitud.folio}
                            </h3>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '6px', 
                              fontSize: '12px', 
                              fontWeight: '500',
                              backgroundColor: solicitud.status_autorizacion === 'Aprobado' ? '#dcfce7' : 
                                           solicitud.status_autorizacion === 'Rechazado' ? '#fee2e2' : '#fef3c7',
                              color: solicitud.status_autorizacion === 'Aprobado' ? '#16a34a' : 
                                     solicitud.status_autorizacion === 'Rechazado' ? '#dc2626' : '#f59e0b'
                            }}>
                              {solicitud.status_autorizacion}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <span>👤</span>
                              <span style={{ fontWeight: '500', color: '#374151' }}>Usuario:</span>
                              {solicitud.solicitante}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <span>📅</span>
                              <span style={{ fontWeight: '500', color: '#374151' }}>Fecha:</span>
                              {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES')}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>🏢</span>
                              <span style={{ fontWeight: '500', color: '#374151' }}>Empresa que paga:</span>
                              {solicitud.empresa_generadora}
                            </div>
                          </div>
                          
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            <p><strong>Proyecto:</strong> {solicitud.proyecto}</p>
                            <p><strong>Bienes:</strong> {solicitud.bienes_solicitud?.length || 0} artículo(s)</p>
                          </div>
                          
                        </div>
                        
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                              {new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2
                              }).format(solicitud.total_estimado || 0)}
                            </div>
                          </div>
                          
                          {/* Botón para revisar solicitud */}
                          {solicitud.status_autorizacion === 'Pendiente' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => abrirPantallaDetalle(solicitud.id)}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#2563eb',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                👁️ Revisar
                              </button>
                            </div>
                          )}
                          
                          {/* Estado ya procesado */}
                          {solicitud.status_autorizacion !== 'Pendiente' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {solicitud.status_autorizacion === 'Aprobado' ? '✅ Aprobado' : '❌ Rechazado'}
                                {solicitud.fecha_autorizacion && (
                                  <div style={{ fontSize: '10px', marginTop: '2px' }}>
                                    {new Date(solicitud.fecha_autorizacion).toLocaleDateString('es-ES')}
                                  </div>
                                )}
                              </div>
                              
                              {/* Botón para procesar en finanzas */}
                              {solicitud.status_autorizacion === 'Aprobado' && solicitud.status_finanzas === 'Pendiente' && (
                                <button
                                  onClick={() => abrirModalFinanzas(solicitud.id)}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#7c3aed',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                >
                                  💰 Procesar
                                </button>
                              )}
                              
                              {/* Botón para adjuntar factura */}
                              {solicitud.status_finanzas === 'Procesado' && solicitud.status_factura !== 'Completado' && (
                                <button
                                  onClick={() => abrirModalFactura(solicitud.id)}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                >
                                  📄 Adjuntar Factura
                                </button>
                              )}
                              
                              {/* Estado de finanzas */}
                              {solicitud.status_finanzas === 'Procesado' && solicitud.status_factura === 'Completado' && (
                                <div style={{ fontSize: '11px', color: '#059669', fontWeight: '500' }}>
                                  ✅ Completado
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Línea de tiempo en la parte inferior */}
                      <div style={{ 
                        marginTop: '16px', 
                        paddingTop: '16px', 
                        borderTop: '1px solid #e5e7eb' 
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          position: 'relative',
                          gap: '12px'
                        }}>
                          {/* Etapa 1: Solicitud */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            zIndex: 2,
                            backgroundColor: 'white',
                            padding: '0 8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: solicitud.status_autorizacion !== 'Pendiente' ? '#10b981' : '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                              {solicitud.status_autorizacion !== 'Pendiente' ? '✓' : '1'}
                            </div>
                            <span style={{ 
                              fontSize: '10px', 
                              color: '#6b7280', 
                              marginTop: '4px',
                              textAlign: 'center'
                            }}>
                              Solicitud
                            </span>
                          </div>
                          
                          {/* Conector 1-2 */}
                          <div style={{ width: '12px', height: '2px', backgroundColor: '#e5e7eb', zIndex: 1 }} />
                          
                          {/* Etapa 2: Autorización */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            zIndex: 2,
                            backgroundColor: 'white',
                            padding: '0 8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: solicitud.status_autorizacion === 'Aprobado' ? '#10b981' : 
                                             solicitud.status_autorizacion === 'Rechazado' ? '#ef4444' : '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                              {solicitud.status_autorizacion === 'Aprobado' ? '✓' : 
                               solicitud.status_autorizacion === 'Rechazado' ? '✗' : '2'}
                            </div>
                            <span style={{ 
                              fontSize: '10px', 
                              color: '#6b7280', 
                              marginTop: '4px',
                              textAlign: 'center'
                            }}>
                              Autorización
                            </span>
                          </div>
                          
                          {/* Conector 2-3 */}
                          <div style={{ width: '12px', height: '2px', backgroundColor: '#e5e7eb', zIndex: 1 }} />
                          
                          {/* Etapa 3: Finanzas */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            zIndex: 2,
                            backgroundColor: 'white',
                            padding: '0 8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: solicitud.status_finanzas === 'Procesado' ? '#10b981' : 
                                             (solicitud.status_autorizacion === 'Aprobado' ? '#3b82f6' : '#6b7280'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                              {solicitud.status_finanzas === 'Procesado' ? '✓' : '3'}
                            </div>
                            <span style={{ 
                              fontSize: '10px', 
                              color: '#6b7280', 
                              marginTop: '4px',
                              textAlign: 'center'
                            }}>
                              Finanzas
                            </span>
                          </div>
                          
                          {/* Conector 3-4 */}
                          <div style={{ width: '12px', height: '2px', backgroundColor: '#e5e7eb', zIndex: 1 }} />
                          
                          {/* Etapa 4: Factura */}
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            zIndex: 2,
                            backgroundColor: 'white',
                            padding: '0 8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: solicitud.status_factura === 'Completado' ? '#10b981' : 
                                             (solicitud.status_finanzas === 'Procesado' ? '#3b82f6' : '#6b7280'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                              {solicitud.status_factura === 'Completado' ? '✓' : '4'}
                            </div>
                            <span style={{ 
                              fontSize: '10px', 
                              color: '#6b7280', 
                              marginTop: '4px',
                              textAlign: 'center'
                            }}>
                              Factura
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>📅</span>
                              {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                              ${gasto.monto.toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => eliminarGasto(gasto.id)}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              padding: '8px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal de formulario de Solicitud de Compra */}
            {showForm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  maxWidth: '800px',
                  width: '95%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Nueva Solicitud de Compra</h2>
                    <button
                      onClick={() => setShowForm(false)}
                      style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Información de fecha automática */}
                    <div style={{ 
                      padding: '12px', 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: '8px', 
                      border: '1px solid #e5e7eb',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        📅 Fecha de Solicitud: {new Date().toLocaleDateString('es-MX')}
                      </span>
                    </div>

                    {/* SECCIÓN GENERAL */}
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '12px', 
                      border: '2px solid #e2e8f0' 
                    }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#1e293b', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        📋 Información General
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Solicitante */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                            Solicitante *
                          </label>
                          <input
                            type="text"
                            value={nuevaSolicitud.solicitante}
                            readOnly
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              backgroundColor: '#f9fafb',
                              color: '#6b7280'
                            }}
                            placeholder="Email del usuario logueado"
                          />
                        </div>

                        {/* Centro de Costo y Proyecto */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Centro de Costo
                            </label>
                            <select
                              value={nuevaSolicitud.centro_costo}
                              onChange={(e) => {
                                const codigoSeleccionado = e.target.value
                                const centroSeleccionado = centrosCosto.find(centro => centro.codigo === codigoSeleccionado)
                                setNuevaSolicitud({
                                  ...nuevaSolicitud, 
                                  centro_costo: codigoSeleccionado,
                                  proyecto: centroSeleccionado ? centroSeleccionado.nombre_actual : ''
                                })
                              }}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Seleccionar centro de costo</option>
                              {centrosCosto.map((centro) => (
                                <option key={centro.codigo} value={centro.codigo}>
                                  {centro.codigo}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Proyecto (Nombre del Centro)
                            </label>
                            <input
                              type="text"
                              value={nuevaSolicitud.proyecto}
                              readOnly
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                backgroundColor: '#f9fafb',
                                color: '#6b7280'
                              }}
                              placeholder="Selecciona un centro de costo"
                            />
                          </div>
                        </div>

                        {/* Clasificación Inicial */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                            Clasificación Inicial
                          </label>
                          <select
                            value={nuevaSolicitud.clasificacion_inicial}
                            onChange={(e) => setNuevaSolicitud({...nuevaSolicitud, clasificacion_inicial: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="">Selecciona clasificación</option>
                            {clasificacionesIniciales.map((clasificacion) => (
                              <option key={clasificacion.codigo} value={clasificacion.nombre}>
                                {clasificacion.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Meses */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Mes de Servicio
                            </label>
                            <select
                              value={nuevaSolicitud.mes_servicio}
                              onChange={(e) => setNuevaSolicitud({...nuevaSolicitud, mes_servicio: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Selecciona mes</option>
                              <option value="Enero">Enero</option>
                              <option value="Febrero">Febrero</option>
                              <option value="Marzo">Marzo</option>
                              <option value="Abril">Abril</option>
                              <option value="Mayo">Mayo</option>
                              <option value="Junio">Junio</option>
                              <option value="Julio">Julio</option>
                              <option value="Agosto">Agosto</option>
                              <option value="Septiembre">Septiembre</option>
                              <option value="Octubre">Octubre</option>
                              <option value="Noviembre">Noviembre</option>
                              <option value="Diciembre">Diciembre</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Mes de Pago
                            </label>
                            <select
                              value={nuevaSolicitud.mes_pago}
                              onChange={(e) => setNuevaSolicitud({...nuevaSolicitud, mes_pago: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Selecciona mes</option>
                              <option value="Enero">Enero</option>
                              <option value="Febrero">Febrero</option>
                              <option value="Marzo">Marzo</option>
                              <option value="Abril">Abril</option>
                              <option value="Mayo">Mayo</option>
                              <option value="Junio">Junio</option>
                              <option value="Julio">Julio</option>
                              <option value="Agosto">Agosto</option>
                              <option value="Septiembre">Septiembre</option>
                              <option value="Octubre">Octubre</option>
                              <option value="Noviembre">Noviembre</option>
                              <option value="Diciembre">Diciembre</option>
                            </select>
                          </div>
                        </div>

                        {/* Empresas */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Empresa Generadora
                            </label>
                            <select
                              value={nuevaSolicitud.empresa_generadora}
                              onChange={(e) => setNuevaSolicitud({...nuevaSolicitud, empresa_generadora: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Selecciona empresa generadora</option>
                              {empresasGeneradoras.map((empresa) => (
                                <option key={empresa.codigo} value={empresa.nombre}>
                                  {empresa.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                              Empresa Pagadora
                            </label>
                            <select
                              value={nuevaSolicitud.empresa_pagadora}
                              onChange={(e) => setNuevaSolicitud({...nuevaSolicitud, empresa_pagadora: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Selecciona empresa pagadora</option>
                              {empresasGeneradoras.map((empresa) => (
                                <option key={empresa.codigo} value={empresa.nombre}>
                                  {empresa.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Código Contable */}
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                            Código Contable
                          </label>
                          <select
                            value={nuevaSolicitud.codigo_contable}
                            onChange={(e) => setNuevaSolicitud({...nuevaSolicitud, codigo_contable: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="">Selecciona código contable</option>
                            {(() => {
                              const cuentasFiltradas = cuentasContables.filter(cuenta => cuenta.empresa === nuevaSolicitud.empresa_generadora);
                              return cuentasFiltradas.map((cuenta) => (
                                <option key={`${cuenta.empresa}-${cuenta.codigo}`} value={cuenta.codigo}>
                                  {cuenta.codigo} - {cuenta.nombre}
                                </option>
                              ));
                            })()}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECCIÓN DETALLE - BIENES */}
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#fefce8', 
                      borderRadius: '12px', 
                      border: '2px solid #fde047' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          🛒 Detalle de Bienes
                        </h3>
                        <button
                          type="button"
                          onClick={agregarBien}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          ➕ Agregar Bien
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {bienes.map((bien, index) => (
                          <div key={bien.id} style={{
                            padding: '16px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            position: 'relative'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#374151', margin: 0 }}>
                                Bien #{bienes.length - index}
                              </h4>
                              {bienes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => eliminarBien(bien.id)}
                                  style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  🗑️ Eliminar
                                </button>
                              )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                  Cantidad *
                                </label>
                                <input
                                  type="number"
                                  value={bien.cantidad}
                                  onChange={(e) => actualizarBien(bien.id, 'cantidad', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                  }}
                                  placeholder="1"
                                  min="1"
                                  step="1"
                                  required
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                  Descripción del Bien *
                                </label>
                                <textarea
                                  value={bien.descripcion}
                                  onChange={(e) => actualizarBien(bien.id, 'descripcion', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    minHeight: '60px',
                                    resize: 'vertical'
                                  }}
                                  placeholder="Describe el bien o servicio. Puedes incluir URLs de referencia, enlaces a catálogos, especificaciones técnicas, etc."
                                  required
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                  Monto Estimado *
                                </label>
                                <input
                                  type="number"
                                  value={bien.monto_estimado}
                                  onChange={(e) => actualizarBien(bien.id, 'monto_estimado', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                  }}
                                  placeholder="0.00"
                                  step="0.01"
                                  min="0"
                                  required
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                                  Moneda
                                </label>
                                <select
                                  value={bien.moneda}
                                  onChange={(e) => actualizarBien(bien.id, 'moneda', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                  }}
                                >
                                  <option value="MXN">MXN</option>
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#1e293b',
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>
                          Total Estimado: {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                            minimumFractionDigits: 2
                          }).format(calcularTotal())}
                        </span>
                      </div>
                    </div>

                    {/* Sección de Factura (Opcional) */}
                    <div style={{ 
                      backgroundColor: '#f8fafc', 
                      padding: '20px', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      marginTop: '24px'
                    }}>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#374151', 
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        📄 Factura de la Compra (Opcional)
                      </h3>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={manejarArchivosFactura}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white'
                          }}
                        />
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#6b7280', 
                          marginTop: '4px' 
                        }}>
                          Formatos permitidos: PDF, JPG, PNG, DOC, DOCX
                        </p>
                      </div>
                      
                      {/* Lista de archivos seleccionados */}
                      {archivosFactura.length > 0 && (
                        <div>
                          <h4 style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: '#374151', 
                            marginBottom: '8px' 
                          }}>
                            Archivos seleccionados:
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {archivosFactura.map((archivo, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>📄</span>
                                  <span style={{ fontSize: '14px', color: '#374151' }}>
                                    {archivo.name}
                                  </span>
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => eliminarArchivoFactura(index)}
                                  style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  🗑️ Eliminar
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button
                        onClick={() => setShowForm(false)}
                        style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={agregarSolicitud}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Guardar Solicitud
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Pantalla de Detalle de Solicitud */}
      {pantallaDetalle.abierta && pantallaDetalle.solicitud && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Detalle de Solicitud de Compra
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Folio: {pantallaDetalle.solicitud.folio}
                </p>
              </div>
              <button
                onClick={cerrarPantallaDetalle}
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Información General */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                📋 Información General
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Solicitante</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.solicitante}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Fecha de Solicitud</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>
                    {new Date(pantallaDetalle.solicitud.fecha_solicitud).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Centro de Costo</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.centro_costo}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Proyecto</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.proyecto}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Clasificación Inicial</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.clasificacion_inicial}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Mes de Servicio</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.mes_servicio}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Mes de Pago</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.mes_pago}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Empresa Generadora</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.empresa_generadora}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Empresa Pagadora</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.empresa_pagadora}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Código Contable</label>
                  <p style={{ fontSize: '16px', color: '#111827', margin: '4px 0' }}>{pantallaDetalle.solicitud.codigo_contable}</p>
                </div>
              </div>
            </div>

            {/* Bienes Solicitados */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                🛒 Bienes Solicitados
              </h3>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                {pantallaDetalle.solicitud.bienes_solicitud?.map((bien: any, index: number) => (
                  <div key={bien.id} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    marginBottom: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        Bien #{index + 1}
                      </h4>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                          minimumFractionDigits: 2
                        }).format(bien.monto_estimado || 0)}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '14px' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>Cantidad:</span> {bien.cantidad}
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Moneda:</span> {bien.moneda}
                      </div>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>Descripción:</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#111827' }}>{bien.descripcion}</p>
                    </div>
                  </div>
                ))}
                
                {/* Total */}
                <div style={{ 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>
                    Total Estimado: {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      minimumFractionDigits: 2
                    }).format(pantallaDetalle.solicitud.total_estimado || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={cerrarPantallaDetalle}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
              <button
                onClick={() => abrirModalAutorizacion(pantallaDetalle.solicitud.id, 'Aprobado')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ✅ Aprobar Solicitud
              </button>
              <button
                onClick={() => abrirModalAutorizacion(pantallaDetalle.solicitud.id, 'Rechazado')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ❌ Rechazar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Autorización */}
      {modalAutorizacion.abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                {modalAutorizacion.accion === 'Aprobado' ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {modalAutorizacion.accion === 'Aprobado' 
                  ? '¿Estás seguro de que deseas aprobar esta solicitud de compra?'
                  : '¿Estás seguro de que deseas rechazar esta solicitud de compra?'
                }
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Observaciones {modalAutorizacion.accion === 'Rechazado' ? '*' : '(Opcional)'}
              </label>
              <textarea
                value={modalAutorizacion.observacion}
                onChange={(e) => setModalAutorizacion(prev => ({ ...prev, observacion: e.target.value }))}
                placeholder={modalAutorizacion.accion === 'Rechazado' 
                  ? 'Explica el motivo del rechazo...'
                  : 'Agrega comentarios adicionales...'
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                required={modalAutorizacion.accion === 'Rechazado'}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cerrarModalAutorizacion}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={procesarAutorizacion}
                disabled={modalAutorizacion.accion === 'Rechazado' && !modalAutorizacion.observacion.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: modalAutorizacion.accion === 'Aprobado' ? '#16a34a' : '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: modalAutorizacion.accion === 'Rechazado' && !modalAutorizacion.observacion.trim() ? 'not-allowed' : 'pointer',
                  opacity: modalAutorizacion.accion === 'Rechazado' && !modalAutorizacion.observacion.trim() ? 0.5 : 1
                }}
              >
                {modalAutorizacion.accion === 'Aprobado' ? 'Aprobar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Finanzas */}
      {modalFinanzas.abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                💰 Procesar en Finanzas
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Completa la información financiera para procesar esta solicitud
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Clasificación Finanzas */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Clasificación Finanzas *
                </label>
                <select
                  value={modalFinanzas.clasificacion}
                  onChange={(e) => setModalFinanzas(prev => ({ ...prev, clasificacion: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">Selecciona clasificación</option>
                  {clasificacionesFinanzas.map((clasif) => (
                    <option key={clasif.codigo} value={clasif.nombre}>
                      {clasif.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Código Contable Finanzas */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Código Contable Finanzas *
                </label>
                <select
                  value={modalFinanzas.codigo_contable}
                  onChange={(e) => setModalFinanzas(prev => ({ ...prev, codigo_contable: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">Selecciona código contable</option>
                  {cuentasContables.map((cuenta) => (
                    <option key={cuenta.codigo} value={cuenta.codigo}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado de Pago */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Estado de Pago *
                </label>
                <select
                  value={modalFinanzas.estado_pago}
                  onChange={(e) => setModalFinanzas(prev => ({ ...prev, estado_pago: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">Selecciona estado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Parcial">Parcial</option>
                </select>
              </div>

              {/* Evidencia del Pago - Archivos */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Subir Archivos de Evidencia
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={manejarArchivos}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Formatos permitidos: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
                </p>
              </div>

              {/* Lista de archivos seleccionados */}
              {modalFinanzas.archivos.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Archivos Seleccionados ({modalFinanzas.archivos.length})
                  </label>
                  <div style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '12px',
                    backgroundColor: '#f9fafb'
                  }}>
                    {modalFinanzas.archivos.map((archivo, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📎</span>
                          <span style={{ fontSize: '14px', color: '#111827' }}>{archivo.name}</span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => eliminarArchivo(index)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ✕ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Observaciones de Finanzas
                </label>
                <textarea
                  value={modalFinanzas.observaciones}
                  onChange={(e) => setModalFinanzas(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Agrega comentarios adicionales sobre el procesamiento financiero..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={cerrarModalFinanzas}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={procesarFinanzas}
                disabled={!modalFinanzas.clasificacion || !modalFinanzas.codigo_contable || !modalFinanzas.estado_pago}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !modalFinanzas.clasificacion || !modalFinanzas.codigo_contable || !modalFinanzas.estado_pago ? 'not-allowed' : 'pointer',
                  opacity: !modalFinanzas.clasificacion || !modalFinanzas.codigo_contable || !modalFinanzas.estado_pago ? 0.5 : 1
                }}
              >
                Procesar en Finanzas
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Factura */}
      {modalFactura.abierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📄 Adjuntar Factura
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Seleccionar archivos de factura
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={manejarArchivosFacturaModal}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              />
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginTop: '4px' 
              }}>
                Formatos permitidos: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>
            
            {/* Lista de archivos seleccionados */}
            {modalFactura.archivos.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Archivos seleccionados:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {modalFactura.archivos.map((archivo, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📄</span>
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {archivo.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarArchivoFacturaModal(index)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cerrarModalFactura}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={procesarFactura}
                disabled={modalFactura.archivos.length === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: modalFactura.archivos.length === 0 ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: modalFactura.archivos.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Adjuntar Factura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de Solicitudes simplificado
function SolicitudesPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileText style={{ height: '32px', width: '32px', color: '#2563eb' }} />
              <h1 style={{ marginLeft: '8px', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                Solicitudes de Compra
              </h1>
            </div>
            <button
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
              <span>+</span>
              Nueva Solicitud
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
                <FileText style={{ height: '24px', width: '24px', color: '#2563eb' }} />
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Total Solicitudes</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>0</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7' }}>
                <span style={{ fontSize: '24px' }}>📋</span>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Pendientes</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#16a34a' }}>0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              Lista de Solicitudes (0)
            </h2>
          </div>
          
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <FileText style={{ height: '48px', width: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              No hay solicitudes registradas
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Comienza agregando tu primera solicitud usando el botón "Nueva Solicitud"
            </p>
            <button
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Crear Primera Solicitud
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App