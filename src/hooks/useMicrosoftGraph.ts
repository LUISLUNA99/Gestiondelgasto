import { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import type { AccountInfo } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../lib/msalConfig';
import { SharePointService } from '../lib/sharePointService';

// Declarar propiedades globales para sobrevivir a HMR
declare global {
  interface Window {
    __MSAL_INSTANCE__?: PublicClientApplication;
    __MSAL_INITIALIZED__?: boolean;
  }
}

// Instancia MSAL singleton (sobrevive a recargas HMR)
let msalInstance: PublicClientApplication | null = null;
function getMsal(): PublicClientApplication {
  if (window.__MSAL_INSTANCE__) {
    return window.__MSAL_INSTANCE__;
  }
  const instance = new PublicClientApplication(msalConfig);
  window.__MSAL_INSTANCE__ = instance;
  return instance;
}

// Hook para interactuar con Microsoft Graph
export const useMicrosoftGraph = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharePointService, setSharePointService] = useState<SharePointService | null>(null);

  useEffect(() => {
    const msalInstance = getMsal();

    const initializeAndLoadAccount = async () => {
      // 1. Inicializar MSAL si aún no se ha hecho
      if (!window.__MSAL_INITIALIZED__) {
        try {
          console.log('🔄 Inicializando MSAL...');
          await msalInstance.initialize();
          window.__MSAL_INITIALIZED__ = true;
          console.log('✅ MSAL inicializado.');
        } catch (e) {
          console.error('❌ Error al inicializar MSAL:', e);
          setError(e);
          setIsLoading(false);
          return;
        }
      }

      // 2. Manejar la respuesta del redirect ANTES de buscar la cuenta activa
      try {
        const response = await msalInstance.handleRedirectPromise();
        if (response && response.account) {
          msalInstance.setActiveAccount(response.account);
        }
      } catch (e) {
        console.error('❌ Error en handleRedirectPromise:', e);
        setError(e);
        // No detener el flujo aquí, aún podemos tener una sesión activa
      }

      // 3. Obtener la cuenta activa AHORA (después del redirect)
      const activeAccount = msalInstance.getActiveAccount();
      
      // 4. Establecer la cuenta y obtener el token de acceso
      if (activeAccount) {
        setAccount(activeAccount);
        try {
          const tokenResponse = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
          });
          setAccessToken(tokenResponse.accessToken);
        } catch (e) {
          // Es normal que falle si se necesita interacción, no es un error crítico aquí
          console.warn('⚠️ Fallo acquireTokenSilent:', e);
          // Si el login es requerido, el usuario lo iniciará manualmente
        }
      }

      setIsLoading(false);
    };

    initializeAndLoadAccount();
  }, []);

  useEffect(() => {
    const initializeService = async () => {
      if (accessToken && !sharePointService) {
        try {
          const spService = new SharePointService(accessToken);
          await spService.init(); // Inicializar el servicio
          setSharePointService(spService);
        } catch (initError) {
          console.error("Fallo al inicializar SharePoint Service:", initError);
          setError(initError); // Guardar el error de inicialización
        }
      }
    };
    initializeService();
  }, [accessToken, sharePointService]);

  // Login
  const login = async () => {
    const msalInstance = getMsal();
    await msalInstance.loginRedirect(loginRequest);
  };

  // Cerrar sesión con redirect para experiencia consistente
  const logout = async (): Promise<void> => {
    msalInstance = getMsal();
    await msalInstance.logoutRedirect();
  };

  // Subir un solo archivo (ejemplo)
  const uploadFile = async (file: File, folderPath?: string) => {
    if (!sharePointService) {
      throw new Error('SharePoint Service no está inicializado');
    }
    return await sharePointService.uploadFile(file, folderPath);
  };

  // Subir múltiples archivos
  const uploadMultipleFiles = async (files: File[], folderPath: string, solicitudId?: string) => {
    if (!sharePointService) {
      throw new Error('SharePoint Service no está inicializado');
    }
    return await sharePointService.uploadMultipleFiles(files, folderPath, solicitudId);
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    return await sharePointService.deleteFile(fileId);
  };

  const listFiles = async (folderPath?: string): Promise<any[]> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    return await sharePointService.listFiles(folderPath);
  };

  const createFolder = async (folderPath?: string): Promise<void> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    return await sharePointService.createFolderIfNotExists(folderPath);
  };

  return {
    accessToken,
    account,
    error,
    isLoading,
    sharePointService,
    login,
    logout,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    listFiles,
    createFolder,
  };
};
