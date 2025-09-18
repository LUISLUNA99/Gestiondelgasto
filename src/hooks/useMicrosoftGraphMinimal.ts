import { useState } from 'react';

export const useMicrosoftGraph = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    console.log('🔐 Iniciando sesión con Microsoft...');
    setIsLoading(true);
    
    // Simular login
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({ name: 'Usuario Microsoft', email: 'usuario@microsoft.com' });
      setIsLoading(false);
    }, 1000);
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    setIsAuthenticated(false);
    setUser(null);
  };

  const uploadFile = async (file: File, subfolder: string = '') => {
    console.log(`📁 Subiendo archivo: ${file.name} a ${subfolder}`);
    // Simular URL de SharePoint
    return `https://buzzwordcom.sharepoint.com/sites/gestiongasto/Shared%20Documents/GestionGasto/Archivos/${subfolder}/${file.name}`;
  };

  const uploadMultipleFiles = async (files: File[], subfolder: string = '') => {
    console.log(`📁 Subiendo ${files.length} archivos a ${subfolder}`);
    const urls: string[] = [];
    
    for (const file of files) {
      const url = await uploadFile(file, subfolder);
      urls.push(url);
    }
    
    return urls;
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    uploadFile,
    uploadMultipleFiles,
    isLoading
  };
};
