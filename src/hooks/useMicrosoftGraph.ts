import { useState, useEffect } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../lib/msalConfig';
import { SharePointService } from '../lib/sharePointService';

// Instancia de MSAL (se inicializa cuando se necesita)
let msalInstance: PublicClientApplication | null = null;

export const useMicrosoftGraph = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharePointService, setSharePointService] = useState<SharePointService | null>(null);

  // Inicializar MSAL
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        if (!msalInstance) {
          msalInstance = new PublicClientApplication(msalConfig);
        }
        await msalInstance.initialize();
        
        // Verificar si hay una cuenta activa
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          setUser(account);
          setIsAuthenticated(true);
          
          // Obtener token de acceso
          await getAccessToken();
        }
      } catch (error) {
        console.error('Error al inicializar MSAL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMsal();
  }, []);

  // Obtener token de acceso
  const getAccessToken = async (): Promise<string | null> => {
    try {
      if (!msalInstance) return null;
      
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) return null;

      const account = accounts[0];
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      setAccessToken(response.accessToken);
      
      // Crear instancia del servicio de SharePoint
      const service = new SharePointService(response.accessToken);
      setSharePointService(service);
      
      return response.accessToken;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  };

  // Iniciar sesión
  const login = async (): Promise<void> => {
    try {
      if (!msalInstance) {
        msalInstance = new PublicClientApplication(msalConfig);
        await msalInstance.initialize();
      }
      
      setIsLoading(true);
      const response = await msalInstance.loginPopup(loginRequest);
      
      setUser(response.account);
      setIsAuthenticated(true);
      setAccessToken(response.accessToken);
      
      // Crear instancia del servicio de SharePoint
      const service = new SharePointService(response.accessToken);
      setSharePointService(service);
      
      console.log('✅ Inicio de sesión exitoso');
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      if (!msalInstance) return;
      
      await msalInstance.logoutPopup();
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
      setSharePointService(null);
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw error;
    }
  };

  // Subir archivo a SharePoint
  const uploadFile = async (file: File, folderPath?: string): Promise<any> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    
    return await sharePointService.uploadFile(file, folderPath);
  };

  // Subir múltiples archivos
  const uploadMultipleFiles = async (files: File[], folderPath?: string): Promise<any[]> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    
    return await sharePointService.uploadMultipleFiles(files, folderPath);
  };

  // Eliminar archivo
  const deleteFile = async (fileId: string): Promise<void> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    
    return await sharePointService.deleteFile(fileId);
  };

  // Listar archivos
  const listFiles = async (folderPath?: string): Promise<any[]> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    
    return await sharePointService.listFiles(folderPath);
  };

  // Crear carpeta
  const createFolder = async (folderPath?: string): Promise<void> => {
    if (!sharePointService) {
      throw new Error('Servicio de SharePoint no disponible');
    }
    
    return await sharePointService.createFolderIfNotExists(folderPath);
  };

  return {
    isAuthenticated,
    user,
    accessToken,
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
