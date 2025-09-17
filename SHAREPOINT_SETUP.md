# Configuración de SharePoint para Gestión del Gasto

## 📋 Requisitos Previos

1. **Tenant de Microsoft 365** con SharePoint Online
2. **Permisos de administrador** para crear aplicaciones
3. **Sitio de SharePoint** creado para el proyecto

## 🔧 Paso 1: Crear App Registration en Azure AD

1. Ve a [Azure Portal](https://portal.azure.com)
2. Navega a **Azure Active Directory** > **App registrations**
3. Haz clic en **New registration**
4. Completa los campos:
   - **Name**: `GestionGasto-SharePoint`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Single-page application (SPA)` - `http://localhost:5173`
5. Haz clic en **Register**

## 🔑 Paso 2: Configurar Permisos de API

1. En tu App Registration, ve a **API permissions**
2. Haz clic en **Add a permission**
3. Selecciona **Microsoft Graph**
4. Selecciona **Application permissions** y agrega:
   - `Sites.ReadWrite.All`
   - `Files.ReadWrite.All`
5. Haz clic en **Grant admin consent**

## 📝 Paso 3: Obtener IDs Necesarios

### Client ID
1. En tu App Registration, ve a **Overview**
2. Copia el **Application (client) ID**

### Tenant ID
1. En **Overview**, copia el **Directory (tenant) ID**

### SharePoint Site ID
1. Ve a tu sitio de SharePoint
2. En la URL, copia el ID después de `/sites/`
   - Ejemplo: `https://tuempresa.sharepoint.com/sites/tusitio` → ID: `tusitio`

## 🗂️ Paso 4: Crear Estructura de Carpetas

1. En SharePoint, crea la siguiente estructura:
   ```
   /GestionGasto/
   ├── Archivos/
   │   ├── Facturas/
   │   ├── EvidenciasPago/
   │   └── Documentos/
   ```

## ⚙️ Paso 5: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration (ya existente)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Microsoft Graph Configuration
REACT_APP_AZURE_CLIENT_ID=tu_client_id_de_azure
REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/tu_tenant_id
REACT_APP_REDIRECT_URI=http://localhost:5173

# SharePoint Configuration
REACT_APP_SHAREPOINT_SITE_ID=tu_site_id_de_sharepoint
REACT_APP_SHAREPOINT_DRIVE_ID=tu_drive_id (opcional)
REACT_APP_SHAREPOINT_FOLDER_PATH=/GestionGasto/Archivos
```

## 🚀 Paso 6: Probar la Integración

1. Ejecuta el proyecto: `npm run dev`
2. Inicia sesión con tu cuenta de Microsoft 365
3. Prueba subir un archivo desde el formulario de solicitud
4. Verifica que el archivo aparezca en SharePoint

## 🔍 Solución de Problemas

### Error de permisos
- Verifica que los permisos estén concedidos en Azure AD
- Asegúrate de que el admin haya dado consentimiento

### Error de sitio no encontrado
- Verifica que el Site ID sea correcto
- Asegúrate de que el sitio exista y tengas acceso

### Error de autenticación
- Verifica que el Client ID y Tenant ID sean correctos
- Asegúrate de que la Redirect URI coincida exactamente

## 📚 Recursos Adicionales

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [SharePoint REST API](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
