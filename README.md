# Gestión del Gasto — Proyecto (React + TypeScript + Vite)

Aplicación para gestionar gastos y solicitudes de compra, integrada con Microsoft 365 (MSAL, Graph, SharePoint).

## Requisitos
- Node 18+
- Cuenta Microsoft 365 con SharePoint

## Variables de entorno (`.env`)

```env
VITE_REACT_APP_AZURE_CLIENT_ID=...
VITE_REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/<tenant>
VITE_REACT_APP_REDIRECT_URI=http://localhost:5173
VITE_REACT_APP_SHAREPOINT_SITE_ID=<site>
VITE_REACT_APP_SHAREPOINT_FOLDER_PATH=/Documentos/Facturas
```

## Estructura de archivos en SharePoint
Organización por año/mes y subcarpetas por solicitud.

```
/Documentos/Facturas/
└── {YYYY}/{MM}/Solicitud-{uuid}/...
```

El sistema crea carpetas si no existen y soporta miniaturas de imágenes en la revisión.
