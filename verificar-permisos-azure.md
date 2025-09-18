# 🔐 Verificación de Permisos en Azure AD

## 🎯 Objetivo
Verificar que los permisos necesarios estén configurados correctamente en Azure AD para que la aplicación pueda acceder a SharePoint.

## 📍 URL de Azure Portal
**https://portal.azure.com**

## 🔧 Pasos de Verificación

### 1. Acceder a Azure Portal
1. Ve a [portal.azure.com](https://portal.azure.com)
2. Inicia sesión con tu cuenta de Office 365
3. Busca "Azure Active Directory" en el buscador superior

### 2. Encontrar tu App Registration
1. En Azure AD, haz clic en **"App registrations"**
2. Busca la app: **"GestionGasto-SharePoint"**
3. Haz clic en ella para abrirla

### 3. Verificar Permisos de API
1. En el menú lateral, haz clic en **"API permissions"**
2. Deberías ver estos permisos con checkmarks verdes:

#### ✅ Permisos Requeridos:
- **Sites.ReadWrite.All** (Application)
  - Estado: ✅ Granted for [tu organización]
  - Descripción: Read and write items in all site collections

- **Files.ReadWrite.All** (Application)
  - Estado: ✅ Granted for [tu organización]
  - Descripción: Read and write files in all site collections

### 4. Si los permisos NO están concedidos:
1. Haz clic en **"Grant admin consent for [tu organización]"**
2. Confirma la acción
3. Espera a que aparezcan los checkmarks verdes

### 5. Verificar Configuración de Autenticación
1. Ve a **"Authentication"** en el menú lateral
2. Verifica que esté configurado:
   - **Platform**: Single-page application (SPA)
   - **Redirect URIs**: `http://localhost:5173`
   - **Logout URL**: (opcional)

### 6. Verificar Certificados y Secretos
1. Ve a **"Certificates & secrets"**
2. No necesitas crear secretos para SPA
3. La autenticación se hace con PKCE

## ✅ Checklist de Verificación

- [ ] App Registration creada: **GestionGasto-SharePoint**
- [ ] Client ID: `19043264-62ad-4c96-98eb-0762fa2ac68b`
- [ ] Tenant ID: `37911699-f8ef-469f-977d-2531ee53dc5e`
- [ ] Permiso `Sites.ReadWrite.All` concedido
- [ ] Permiso `Files.ReadWrite.All` concedido
- [ ] Redirect URI: `http://localhost:5173`
- [ ] Platform: Single-page application (SPA)

## 🚨 Solución de Problemas

### Error: "Insufficient privileges"
- **Causa**: Los permisos no están concedidos
- **Solución**: Haz clic en "Grant admin consent"

### Error: "Application not found"
- **Causa**: Client ID incorrecto
- **Solución**: Verifica el Client ID en Overview

### Error: "Invalid redirect URI"
- **Causa**: Redirect URI no coincide
- **Solución**: Verifica que sea exactamente `http://localhost:5173`

## 🚀 Siguiente Paso
Una vez verificados los permisos, ejecuta:
```bash
npm run dev
```

Y prueba la autenticación con Microsoft 365.
