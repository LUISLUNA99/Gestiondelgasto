# 📁 Crear Estructura de Carpetas en SharePoint

## 🎯 Objetivo
Crear la estructura de carpetas necesaria en tu sitio de SharePoint para organizar los archivos del sistema.

## 📍 URL de tu sitio
**https://buzzwordcom.sharepoint.com/sites/gestiongasto/**

## 📂 Estructura a crear

### 1. Acceder a SharePoint
1. Ve a: https://buzzwordcom.sharepoint.com/sites/gestiongasto/
2. Inicia sesión con tu cuenta de Office 365
3. Haz clic en **"Documents"** en el menú lateral

### 2. Crear carpeta principal
1. Haz clic en **"New"** > **"Folder"**
2. Nombre: `GestionGasto`
3. Haz clic en **"Create"**

### 3. Crear subcarpetas
Dentro de `GestionGasto`, crea estas carpetas:

#### 3.1 Carpeta Archivos
1. Entra a la carpeta `GestionGasto`
2. Haz clic en **"New"** > **"Folder"**
3. Nombre: `Archivos`
4. Haz clic en **"Create"**

#### 3.2 Subcarpetas dentro de Archivos
Dentro de `Archivos`, crea:

1. **Facturas**
   - New > Folder > Nombre: `Facturas`

2. **EvidenciasPago**
   - New > Folder > Nombre: `EvidenciasPago`

3. **Documentos**
   - New > Folder > Nombre: `Documentos`

## 📋 Estructura final
```
/Documents/
└── GestionGasto/
    └── Archivos/
        ├── Facturas/
        ├── EvidenciasPago/
        └── Documentos/
```

## ✅ Verificación
Una vez creada la estructura, deberías ver:
- ✅ Carpeta `GestionGasto` en Documents
- ✅ Carpeta `Archivos` dentro de GestionGasto
- ✅ Tres subcarpetas dentro de Archivos

## 🚀 Siguiente paso
Una vez creada la estructura, ejecuta:
```bash
npm run dev
```

Y prueba la funcionalidad de subida de archivos.
