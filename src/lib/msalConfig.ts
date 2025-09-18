import { Configuration, PopupRequest } from '@azure/msal-browser';

// Configuración de MSAL
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_REACT_APP_AZURE_CLIENT_ID || '', // Tu Client ID de Azure AD
    authority: import.meta.env.VITE_REACT_APP_AZURE_AUTHORITY || 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_REACT_APP_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Configuración de permisos
export const loginRequest: PopupRequest = {
  scopes: [
    'https://graph.microsoft.com/Files.ReadWrite',
    'https://graph.microsoft.com/Sites.ReadWrite.All',
    'https://graph.microsoft.com/User.Read'
  ],
  prompt: 'select_account',
};

// Configuración de SharePoint
export const sharePointConfig = {
  siteId: process.env.REACT_APP_SHAREPOINT_SITE_ID || '', // ID del sitio de SharePoint
  driveId: process.env.REACT_APP_SHAREPOINT_DRIVE_ID || '', // ID del drive (opcional)
  folderPath: process.env.REACT_APP_SHAREPOINT_FOLDER_PATH || '/GestionGasto/Archivos', // Ruta de la carpeta
};
