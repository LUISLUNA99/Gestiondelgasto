# 📁 Arquitectura de Archivos - Gestión del Gasto

## 🎯 **DECISIÓN ARQUITECTÓNICA: SOLO SHAREPOINT**

### **¿Por qué SharePoint y no Supabase Storage?**

**✅ VENTAJAS DE SHAREPOINT:**
- **Integración nativa** con Office 365
- **Gestión centralizada** de archivos empresariales
- **Permisos granulares** por usuario/grupo
- **Versionado automático** de archivos
- **Búsqueda avanzada** en contenido
- **Colaboración en tiempo real**
- **Cumplimiento** con políticas empresariales

**❌ DESVENTAJAS DE SUPABASE STORAGE:**
- **Sistema separado** del ecosistema Microsoft
- **Gestión duplicada** de permisos
- **No integrado** con Office 365
- **Costo adicional** por almacenamiento

## 🏗️ **ARQUITECTURA ACTUAL**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Formulario    │───▶│   SharePoint     │───▶│  Base de Datos  │
│   (React)       │    │   (Archivos)     │    │  (URLs)         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **FLUJO DE ARCHIVOS:**

1. **Usuario selecciona archivos** en el formulario
2. **Archivos se suben** a SharePoint
3. **URLs se guardan** en la base de datos
4. **Archivos se organizan** por carpetas:
   - `/GestionGasto/Archivos/Facturas/`
   - `/GestionGasto/Archivos/EvidenciasPago/`

## 📋 **ESTADO ACTUAL**

### **✅ IMPLEMENTADO:**
- ✅ **Formulario** con selección de archivos
- ✅ **Simulación** de URLs de SharePoint
- ✅ **Base de datos** preparada para URLs
- ✅ **4 fases** de aprobación

### **⏳ PENDIENTE:**
- ⏳ **Configuración** de Azure AD
- ⏳ **Autenticación** con Microsoft
- ⏳ **Subida real** a SharePoint
- ⏳ **Permisos** de acceso

## 🔧 **CONFIGURACIÓN REQUERIDA**

### **1. Azure Active Directory:**
```bash
# Variables de entorno necesarias
VITE_REACT_APP_AZURE_CLIENT_ID=tu_client_id
VITE_REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/tu_tenant_id
VITE_REACT_APP_SHAREPOINT_SITE_ID=gestiongasto
VITE_REACT_APP_SHAREPOINT_FOLDER_PATH=/GestionGasto/Archivos
```

### **2. Permisos de Microsoft Graph:**
- `Sites.ReadWrite.All`
- `Files.ReadWrite.All`
- `User.Read`

### **3. Estructura de Carpetas en SharePoint:**
```
/Documents/
└── GestionGasto/
    └── Archivos/
        ├── Facturas/
        ├── EvidenciasPago/
        └── Documentos/
```

## 🚀 **PRÓXIMOS PASOS**

### **FASE 1: CONFIGURACIÓN (INMEDIATA)**
1. **Configurar Azure AD** siguiendo `GUIA_SHAREPOINT_OFFICE365.md`
2. **Crear estructura** de carpetas en SharePoint
3. **Configurar permisos** de aplicación

### **FASE 2: IMPLEMENTACIÓN (DESPUÉS)**
1. **Activar hook** de Microsoft Graph
2. **Implementar subida real** a SharePoint
3. **Probar funcionalidad** completa

### **FASE 3: PRODUCCIÓN (FINAL)**
1. **Configurar permisos** de usuarios
2. **Implementar políticas** de retención
3. **Monitorear uso** de almacenamiento

## 💡 **VENTAJAS DE ESTA ARQUITECTURA**

### **PARA EL USUARIO:**
- **Acceso familiar** a archivos desde Office 365
- **Colaboración** con otros usuarios
- **Búsqueda** de archivos desde SharePoint
- **Sincronización** con OneDrive

### **PARA LA EMPRESA:**
- **Control centralizado** de archivos
- **Cumplimiento** con políticas
- **Auditoría** de accesos
- **Integración** con herramientas existentes

### **PARA EL DESARROLLO:**
- **API unificada** de Microsoft Graph
- **Autenticación** estándar
- **Escalabilidad** automática
- **Mantenimiento** simplificado

## 🔄 **MIGRACIÓN FUTURA**

Si en el futuro se requiere **Supabase Storage**:
1. **Mantener** la estructura actual
2. **Agregar** opción de configuración
3. **Implementar** adaptador de almacenamiento
4. **Migrar** archivos existentes

## 📊 **COMPARACIÓN DE COSTOS**

| Aspecto | SharePoint | Supabase Storage |
|---------|------------|------------------|
| **Almacenamiento** | Incluido en Office 365 | $0.021/GB/mes |
| **Transferencia** | Incluida | $0.09/GB |
| **API Calls** | Incluidas | $0.001/1000 calls |
| **Gestión** | Automática | Manual |

## 🎯 **CONCLUSIÓN**

**SharePoint es la opción correcta** para este proyecto porque:
- ✅ **Integración nativa** con Office 365
- ✅ **Costo-beneficio** superior
- ✅ **Gestión simplificada** de archivos
- ✅ **Escalabilidad** automática
- ✅ **Cumplimiento** empresarial

**No necesitamos Supabase Storage** para este caso de uso.
