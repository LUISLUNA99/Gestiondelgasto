import React, { useEffect, useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { useMicrosoftGraph } from '../hooks/useMicrosoftGraph'
import { sharePointConfig } from '../lib/msalConfig'

declare global {
  interface Window {
    openSolicitudAdjuntos?: (solicitudId: string) => void
  }
}

const SolicitudesCompra: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [uploaded, setUploaded] = useState<any[]>([])
  const { sharePointService, uploadMultipleFiles, isAuthenticated, login, createFolder } = useMicrosoftGraph()
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewFiles, setReviewFiles] = useState<any[]>([])
  const [currentSolicitudId, setCurrentSolicitudId] = useState<string>('')
  
  // Estados para el gestor de carpetas y archivos
  const [showFileManager, setShowFileManager] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [fileManagerFiles, setFileManagerFiles] = useState<File[]>([])
  const [currentPath, setCurrentPath] = useState(sharePointConfig.folderPath)

  useEffect(() => {
    // si venimos con ?new=1 abrir modal
    const params = new URLSearchParams(window.location.search)
    if (params.get('new') === '1') setShowForm(true)
    // si viene ?solicitudId=... abrir revisión de esa solicitud
    const paramId = params.get('solicitudId') || ''
    if (paramId) {
      setCurrentSolicitudId(paramId)
      setReviewOpen(true)
    }
    // exponer helper global para abrir desde otros componentes
    window.openSolicitudAdjuntos = (id: string) => {
      setCurrentSolicitudId(id)
      setReviewOpen(true)
    }
    return () => {
      delete window.openSolicitudAdjuntos
    }
  }, [])

  // Cargar adjuntos automáticamente cuando haya id y el modal esté abierto
  useEffect(() => {
    const fetchFiles = async () => {
      if (!sharePointService || !reviewOpen || !currentSolicitudId) return
      try {
        setReviewLoading(true)
        const res = await sharePointService.listFilesForSolicitud(currentSolicitudId, sharePointConfig.folderPath)
        setReviewFiles(res)
      } catch (e) {
        console.error(e)
      } finally {
        setReviewLoading(false)
      }
    }
    fetchFiles()
  }, [sharePointService, reviewOpen, currentSolicitudId])

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
            <div style={{ display:'flex', gap:8 }}>
              <button
                onClick={() => setShowFileManager(true)}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📁 Gestor SharePoint
              </button>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🧪 Debug Upload
              </button>
              <button
                onClick={async ()=>{
                  setReviewOpen(true)
                  if (!sharePointService) return
                  try {
                    const id = prompt('ID de solicitud (UUID) para revisar:', currentSolicitudId || '') || ''
                    setCurrentSolicitudId(id)
                    if (!id) return
                    setReviewLoading(true)
                    const res = await sharePointService.listFilesForSolicitud(id, sharePointConfig.folderPath)
                    setReviewFiles(res)
                  } catch (e) {
                    console.error(e)
                  } finally {
                    setReviewLoading(false)
                  }
                }}
                style={{
                  backgroundColor: '#0f766e',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Revisión
              </button>
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
                Nueva Solicitud
              </button>
            </div>
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
                <FileText style={{ height: '24px', width: '24px', color: '#16a34a' }} />
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
              onClick={() => setShowForm(true)}
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

      {/* Modal de formulario simple */}
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Nueva Solicitud de Compra</h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <FileText style={{ height: '64px', width: '64px', color: '#9ca3af', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                Adjuntar archivos (SharePoint)
              </h3>
              {!isAuthenticated && (
                <>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                    Inicia sesión con Microsoft para subir documentos a SharePoint.
                  </p>
                  <button onClick={login} style={{ background:'#2563eb', color:'#fff', padding:'10px 16px', border:'none', borderRadius:8, cursor:'pointer', marginBottom:16 }}>Iniciar sesión Microsoft</button>
                </>
              )}
              <div style={{ marginBottom: '16px' }}>
                <input type="file" multiple onChange={(e)=> setFiles(Array.from(e.target.files||[]))} />
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
                <button
                  disabled={!sharePointService || files.length===0 || saving}
                  onClick={async ()=>{
                    if (!sharePointService || files.length===0) return
                    try {
                      setSaving(true)
                      // Generar UUID automático para debug
                      const debugId = crypto.randomUUID()
                      setCurrentSolicitudId(debugId)
                      console.log('🧪 DEBUG: Usando UUID automático:', debugId)
                      // Subir usando baseFolder y que el servicio construya {YYYY}/{MM}/{id}
                      const baseFolder = sharePointConfig.folderPath
                      console.log('🧪 DEBUG: Base folder:', baseFolder)
                      const res = await uploadMultipleFiles(files, baseFolder, debugId)
                      setUploaded(res)
                      alert(`✅ Debug: Archivos subidos exitosamente con UUID: ${debugId}`)
                    } catch (e) {
                      alert('❌ No se pudieron subir archivos')
                      console.error(e)
                    } finally {
                      setSaving(false)
                    }
                  }}
                  style={{ backgroundColor: '#059669', color:'#fff', padding:'10px 16px', border:'none', borderRadius:8, cursor:'pointer' }}
                >{saving ? 'Subiendo...' : '🧪 Debug: Subir Archivos'}</button>
                
                <button
                  disabled={!sharePointService || reviewLoading}
                  onClick={async ()=>{
                    if (!sharePointService) return
                    try {
                      setReviewLoading(true)
                      const testId = prompt('UUID de solicitud para probar listado:', currentSolicitudId || '') || ''
                      if (testId) {
                        console.log('🧪 DEBUG: Listando archivos para UUID:', testId)
                        const files = await sharePointService.listFilesForSolicitud(testId)
                        console.log('🧪 DEBUG: Archivos encontrados:', files)
                        setReviewFiles(files)
                        setReviewOpen(true)
                        alert(`✅ Debug: Encontrados ${files.length} archivos para UUID: ${testId}`)
                      }
                    } catch (e) {
                      alert('❌ Error al listar archivos')
                      console.error(e)
                    } finally {
                      setReviewLoading(false)
                    }
                  }}
                  style={{ backgroundColor: '#3b82f6', color:'#fff', padding:'10px 16px', border:'none', borderRadius:8, cursor:'pointer' }}
                >{reviewLoading ? 'Listando...' : '🧪 Debug: Listar Archivos'}</button>
                
                <button onClick={()=> setShowForm(false)} style={{ background:'#6b7280', color:'#fff', padding:'10px 16px', border:'none', borderRadius:8, cursor:'pointer' }}>Cerrar</button>
              </div>

              {/* Previsualización de archivos subidos */}
              {uploaded.length>0 && (
                <div style={{ textAlign:'left' }}>
                  <h4 style={{ fontSize:14, fontWeight:600, color:'#111827', margin:'8px 0' }}>Archivos subidos</h4>
                  <div style={{ display:'grid', gap:8 }}>
                    {uploaded.map((f:any,i:number)=>{
                      const isImg = !!f?.isImage || (typeof f?.mimeType==='string' && f.mimeType.startsWith('image/'))
                      return (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, border:'1px solid #e5e7eb', borderRadius:8, padding:8 }}>
                          <div style={{ width:56, height:56, borderRadius:6, overflow:'hidden', background:'#fff', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {isImg ? (
                              <img src={f.thumbnailUrl || f.downloadUrl || f.webUrl} alt={f.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            ) : (
                              <span>📄</span>
                            )}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:14, fontWeight:500 }}>{f.name}</div>
                            <div style={{ fontSize:12, color:'#6b7280' }}>{(Number(f.size||0)/1024).toFixed(1)} KB</div>
                          </div>
                          {f.webUrl && <a href={f.webUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#2563eb' }}>Abrir</a>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Revisión */}
      {reviewOpen && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60 }}>
          <div style={{ background:'#fff', borderRadius:'12px', padding:'24px', width:'95%', maxWidth:'900px', maxHeight:'90vh', overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <h3 style={{ fontSize:'18px', fontWeight:600, color:'#111827' }}>Revisión de Archivos (SharePoint)</h3>
              <button onClick={()=> setReviewOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280' }}>✕</button>
            </div>
            {!sharePointService && (
              <div style={{ marginBottom:12, color:'#6b7280' }}>Inicia sesión con Microsoft para listar archivos.</div>
            )}
            {reviewLoading ? (
              <div style={{ color:'#6b7280', fontStyle:'italic', textAlign:'center', padding:'20px' }}>Cargando archivos...</div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12 }}>
                {reviewFiles.map((f:any, i:number)=>{
                  const isImg = !!f?.isImage || (typeof f?.mimeType==='string' && f.mimeType.startsWith('image/'))
                  return (
                    <div key={i} style={{ border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden', background:'#fff' }}>
                      <div style={{ width:'100%', height:140, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {isImg ? (
                          <img src={f.thumbnailUrl || f.downloadUrl || f.webUrl} alt={f.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        ) : (
                          <span style={{ fontSize:24 }}>📄</span>
                        )}
                      </div>
                      <div style={{ padding:12 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:'#111827', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                        <div style={{ fontSize:12, color:'#6b7280', marginBottom:8 }}>{(Number(f.size||0)/1024).toFixed(1)} KB</div>
                        {f.webUrl && <a href={f.webUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#2563eb' }}>Abrir en SharePoint</a>}
                      </div>
                    </div>
                  )
                })}
                {reviewFiles.length===0 && (
                  <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#6b7280' }}>No hay archivos en la carpeta de revisión</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Gestor de Carpetas y Archivos SharePoint */}
      {showFileManager && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70 }}>
          <div style={{ background:'#fff', borderRadius:'12px', padding:'24px', width:'95%', maxWidth:'800px', maxHeight:'90vh', overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h3 style={{ fontSize:'20px', fontWeight:600, color:'#111827' }}>📁 Gestor de SharePoint</h3>
              <button onClick={()=> setShowFileManager(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'#6b7280' }}>✕</button>
            </div>

            {!isAuthenticated ? (
              <div style={{ textAlign:'center', padding:'40px' }}>
                <p style={{ color:'#6b7280', marginBottom:'16px' }}>Inicia sesión con Microsoft para gestionar archivos en SharePoint.</p>
                <button onClick={login} style={{ background:'#2563eb', color:'#fff', padding:'12px 24px', border:'none', borderRadius:8, cursor:'pointer' }}>Iniciar sesión Microsoft</button>
              </div>
            ) : (
              <>
                {/* Ruta actual */}
                <div style={{ padding:'12px', background:'#f3f4f6', borderRadius:8, marginBottom:20, fontSize:14, color:'#374151' }}>
                  <strong>Ruta actual:</strong> {currentPath}
                </div>

                {/* Sección: Crear carpeta */}
                <div style={{ marginBottom:24, padding:20, background:'#eff6ff', borderRadius:8, border:'1px solid #dbeafe' }}>
                  <h4 style={{ fontSize:16, fontWeight:600, marginBottom:12, color:'#1e40af' }}>Crear Nueva Carpeta</h4>
                  <div style={{ display:'flex', gap:8 }}>
                    <input
                      type="text"
                      placeholder="Nombre de la carpeta (ej: Facturas, Documentos)"
                      value={newFolderName}
                      onChange={(e)=> setNewFolderName(e.target.value)}
                      style={{ flex:1, padding:'10px', border:'1px solid #cbd5e1', borderRadius:6, fontSize:14 }}
                    />
                    <button
                      disabled={!newFolderName.trim() || creatingFolder}
                      onClick={async ()=>{
                        if (!sharePointService || !newFolderName.trim()) return
                        try {
                          setCreatingFolder(true)
                          const fullPath = `${currentPath}/${newFolderName.trim()}`
                          await createFolder(fullPath)
                          alert(`✅ Carpeta "${newFolderName}" creada exitosamente en:\n${fullPath}`)
                          setNewFolderName('')
                        } catch (e) {
                          alert('❌ Error al crear carpeta')
                          console.error(e)
                        } finally {
                          setCreatingFolder(false)
                        }
                      }}
                      style={{
                        background: newFolderName.trim() ? '#2563eb' : '#cbd5e1',
                        color:'#fff',
                        padding:'10px 20px',
                        border:'none',
                        borderRadius:6,
                        cursor: newFolderName.trim() ? 'pointer' : 'not-allowed',
                        fontWeight:600
                      }}
                    >
                      {creatingFolder ? 'Creando...' : '➕ Crear'}
                    </button>
                  </div>
                  <p style={{ fontSize:12, color:'#6b7280', marginTop:8 }}>
                    💡 Tip: También puedes crear subcarpetas usando "/" (ej: Facturas/2025/10)
                  </p>
                </div>

                {/* Sección: Subir archivos */}
                <div style={{ padding:20, background:'#f0fdf4', borderRadius:8, border:'1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize:16, fontWeight:600, marginBottom:12, color:'#166534' }}>Subir Archivos</h4>
                  <div style={{ marginBottom:12 }}>
                    <input
                      type="file"
                      multiple
                      onChange={(e)=> setFileManagerFiles(Array.from(e.target.files||[]))}
                      style={{ fontSize:14 }}
                    />
                  </div>
                  {fileManagerFiles.length > 0 && (
                    <div style={{ marginBottom:12, padding:12, background:'#fff', borderRadius:6, border:'1px solid #d1d5db' }}>
                      <p style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>Archivos seleccionados:</p>
                      <ul style={{ fontSize:12, color:'#374151', paddingLeft:20 }}>
                        {fileManagerFiles.map((f,i)=> <li key={i}>{f.name} ({(f.size/1024).toFixed(1)} KB)</li>)}
                      </ul>
                    </div>
                  )}
                  <div style={{ display:'flex', gap:8 }}>
                    <button
                      disabled={fileManagerFiles.length===0 || uploadingFiles}
                      onClick={async ()=>{
                        if (!sharePointService || fileManagerFiles.length===0) return
                        try {
                          setUploadingFiles(true)
                          const results = await uploadMultipleFiles(fileManagerFiles, currentPath)
                          alert(`✅ ${results.length} archivo(s) subido(s) exitosamente a:\n${currentPath}`)
                          setFileManagerFiles([])
                        } catch (e) {
                          alert('❌ Error al subir archivos')
                          console.error(e)
                        } finally {
                          setUploadingFiles(false)
                        }
                      }}
                      style={{
                        flex:1,
                        background: fileManagerFiles.length > 0 ? '#059669' : '#cbd5e1',
                        color:'#fff',
                        padding:'12px 20px',
                        border:'none',
                        borderRadius:6,
                        cursor: fileManagerFiles.length > 0 ? 'pointer' : 'not-allowed',
                        fontWeight:600
                      }}
                    >
                      {uploadingFiles ? '⏳ Subiendo...' : `📤 Subir ${fileManagerFiles.length > 0 ? `(${fileManagerFiles.length})` : ''}`}
                    </button>
                    {fileManagerFiles.length > 0 && (
                      <button
                        onClick={()=> setFileManagerFiles([])}
                        style={{ background:'#ef4444', color:'#fff', padding:'12px 20px', border:'none', borderRadius:6, cursor:'pointer' }}
                      >
                        🗑️ Limpiar
                      </button>
                    )}
                  </div>
                </div>

                {/* Información adicional */}
                <div style={{ marginTop:20, padding:16, background:'#fef3c7', borderRadius:8, border:'1px solid #fcd34d' }}>
                  <p style={{ fontSize:13, color:'#92400e', marginBottom:8 }}>
                    <strong>📋 Instrucciones:</strong>
                  </p>
                  <ul style={{ fontSize:12, color:'#92400e', paddingLeft:20, margin:0 }}>
                    <li>Crea carpetas para organizar tus documentos</li>
                    <li>Sube múltiples archivos a la vez</li>
                    <li>Los archivos se guardarán en: <strong>{currentPath}</strong></li>
                    <li>Puedes cambiar la ruta editando el campo "Ruta actual"</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SolicitudesCompra