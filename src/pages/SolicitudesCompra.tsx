import React, { useState } from 'react'
import { Plus, FileText } from 'lucide-react'

const SolicitudesCompra: React.FC = () => {
  const [showForm, setShowForm] = useState(false)

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
                Formulario de Solicitud
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Para usar el formulario completo, primero necesitas ejecutar el esquema SQL en Supabase.
              </p>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SolicitudesCompra