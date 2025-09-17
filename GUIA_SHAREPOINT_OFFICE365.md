# 🚀 Guía Completa: SharePoint con Office 365

## 📋 Resumen
Esta guía te llevará paso a paso para configurar SharePoint como repositorio de archivos en tu sistema de Gestión del Gasto, usando tu cuenta de Office 365.

## ✅ Lo que ya tienes
- ✅ **Office 365** - Tu cuenta empresarial
- ✅ **SharePoint Online** - Incluido en Office 365
- ✅ **Azure AD** - Directorio activo de tu organización
- ✅ **Código implementado** - Todo listo para usar

## 🔧 Paso 1: Configurar Azure AD (5 minutos)

### 1.1 Acceder a Azure Portal
1. Ve a [portal.azure.com](https://portal.azure.com)
2. Inicia sesión con tu cuenta de Office 365
3. Busca "Azure Active Directory" en el buscador superior

### 1.2 Crear App Registration
1. En Azure AD, haz clic en **"App registrations"**
2. Haz clic en **"New registration"**
3. Completa los campos:
   - **Name**: `GestionGasto-SharePoint`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Single-page application (SPA)` - `http://localhost:5173`
4. Haz clic en **"Register"**

### 1.3 Obtener IDs
Después de crear la app, copia estos valores:
- **Client ID**: En "Overview" > "Application (client) ID"
- **Tenant ID**: En "Overview" > "Directory (tenant) ID"

## 🔑 Paso 2: Configurar Permisos (3 minutos)

### 2.1 Agregar Permisos de API
1. En tu app, ve a **"API permissions"**
2. Haz clic en **"Add a permission"**
3. Selecciona **"Microsoft Graph"**
4. Selecciona **"Application permissions"**
5. Busca y agrega:
   - `Sites.ReadWrite.All`
   - `Files.ReadWrite.All`
6. Haz clic en **"Add permissions"**

### 2.2 Otorgar Consentimiento
1. Haz clic en **"Grant admin consent for [tu organización]"**
2. Confirma la acción
3. Verifica que aparezcan checkmarks verdes

## 📁 Paso 3: Configurar SharePoint (5 minutos)

### 3.1 Acceder a SharePoint
1. Ve a [sharepoint.com](https://sharepoint.com)
2. Inicia sesión con tu cuenta de Office 365
3. Haz clic en **"Create site"** o usa un sitio existente

### 3.2 Crear Sitio (si es necesario)
1. Selecciona **"Team site"**
2. Nombre del sitio: `GestionGasto`
3. Haz clic en **"Next"** y luego **"Finish"**

### 3.3 Obtener Site ID
1. En la URL del sitio, copia el ID después de `/sites/`
   - Ejemplo: `https://tuempresa.sharepoint.com/sites/gestiongasto` → ID: `gestiongasto`

### 3.4 Crear Estructura de Carpetas
1. En SharePoint, ve a **"Documents"**
2. Crea la siguiente estructura:
   ```
   /GestionGasto/
   ├── Archivos/
   │   ├── Facturas/
   │   ├── EvidenciasPago/
   │   └── Documentos/
   ```

## ⚙️ Paso 4: Configurar Variables de Entorno (2 minutos)

### 4.1 Editar .env.local
El archivo `.env.local` ya fue creado. Edítalo y reemplaza:

```env
# Microsoft Graph Configuration
REACT_APP_AZURE_CLIENT_ID=TU_CLIENT_ID_AQUI
REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/TU_TENANT_ID_AQUI
REACT_APP_REDIRECT_URI=http://localhost:5173

# SharePoint Configuration
REACT_APP_SHAREPOINT_SITE_ID=TU_SITE_ID_AQUI
REACT_APP_SHAREPOINT_DRIVE_ID=
REACT_APP_SHAREPOINT_FOLDER_PATH=/GestionGasto/Archivos
```

### 4.2 Reemplazar Valores
- `TU_CLIENT_ID_AQUI` → Tu Client ID de Azure AD
- `TU_TENANT_ID_AQUI` → Tu Tenant ID de Azure AD
- `TU_SITE_ID_AQUI` → Tu Site ID de SharePoint

## 🚀 Paso 5: Probar la Integración (3 minutos)

### 5.1 Iniciar el Proyecto
```bash
npm run dev
```

### 5.2 Probar Autenticación
1. Abre http://localhost:5173
2. Deberías ver un botón para iniciar sesión con Microsoft
3. Haz clic e inicia sesión con tu cuenta de Office 365

### 5.3 Probar Subida de Archivos
1. Crea una nueva solicitud de compra
2. En la sección de factura, selecciona un archivo
3. Verifica que se suba correctamente a SharePoint

## 🔍 Solución de Problemas

### Error: "Application not found"
- Verifica que el Client ID sea correcto
- Asegúrate de que la app esté en el tenant correcto

### Error: "Insufficient privileges"
- Verifica que los permisos estén concedidos
- Asegúrate de que el admin haya dado consentimiento

### Error: "Site not found"
- Verifica que el Site ID sea correcto
- Asegúrate de que el sitio exista y tengas acceso

### Error: "Authentication failed"
- Verifica que el Tenant ID sea correcto
- Asegúrate de que la Redirect URI coincida exactamente

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador para errores
2. Verifica que todas las variables de entorno estén correctas
3. Asegúrate de que los permisos estén concedidos
4. Confirma que el sitio de SharePoint exista

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu sistema usará SharePoint como repositorio de archivos, manteniendo toda la funcionalidad actual pero con las ventajas de la integración empresarial de Microsoft 365.
