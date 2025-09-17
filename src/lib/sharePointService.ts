import { Client } from '@microsoft/microsoft-graph-client';
import { sharePointConfig } from './msalConfig';

// Interfaz para el servicio de SharePoint
export interface SharePointFile {
  id: string;
  name: string;
  webUrl: string;
  downloadUrl: string;
  size: number;
  createdDateTime: string;
}

// Servicio de SharePoint
export class SharePointService {
  private graphClient: Client;

  constructor(accessToken: string) {
    this.graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  // Subir archivo a SharePoint
  async uploadFile(file: File, folderPath: string = sharePointConfig.folderPath): Promise<SharePointFile> {
    try {
      console.log('📤 Subiendo archivo a SharePoint:', file.name);
      
      // Crear el nombre único del archivo
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${folderPath}/${fileName}`;
      
      // Convertir archivo a ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Subir archivo usando Microsoft Graph
      const uploadResult = await this.graphClient
        .api(`/sites/${sharePointConfig.siteId}/drive/root:/${filePath}:/content`)
        .put(arrayBuffer);
      
      console.log('✅ Archivo subido exitosamente:', uploadResult.name);
      
      return {
        id: uploadResult.id,
        name: uploadResult.name,
        webUrl: uploadResult.webUrl,
        downloadUrl: uploadResult['@microsoft.graph.downloadUrl'],
        size: uploadResult.size,
        createdDateTime: uploadResult.createdDateTime,
      };
    } catch (error) {
      console.error('❌ Error al subir archivo a SharePoint:', error);
      throw new Error(`Error al subir archivo: ${error}`);
    }
  }

  // Subir múltiples archivos
  async uploadMultipleFiles(files: File[], folderPath: string = sharePointConfig.folderPath): Promise<SharePointFile[]> {
    const results: SharePointFile[] = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, folderPath);
        results.push(result);
      } catch (error) {
        console.error(`Error al subir archivo ${file.name}:`, error);
        // Continuar con los demás archivos
      }
    }
    
    return results;
  }

  // Obtener archivo por ID
  async getFile(fileId: string): Promise<SharePointFile> {
    try {
      const file = await this.graphClient
        .api(`/sites/${sharePointConfig.siteId}/drive/items/${fileId}`)
        .get();
      
      return {
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        size: file.size,
        createdDateTime: file.createdDateTime,
      };
    } catch (error) {
      console.error('❌ Error al obtener archivo:', error);
      throw new Error(`Error al obtener archivo: ${error}`);
    }
  }

  // Eliminar archivo
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.graphClient
        .api(`/sites/${sharePointConfig.siteId}/drive/items/${fileId}`)
        .delete();
      
      console.log('✅ Archivo eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar archivo:', error);
      throw new Error(`Error al eliminar archivo: ${error}`);
    }
  }

  // Listar archivos en una carpeta
  async listFiles(folderPath: string = sharePointConfig.folderPath): Promise<SharePointFile[]> {
    try {
      const response = await this.graphClient
        .api(`/sites/${sharePointConfig.siteId}/drive/root:/${folderPath}:/children`)
        .get();
      
      return response.value.map((file: any) => ({
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        size: file.size,
        createdDateTime: file.createdDateTime,
      }));
    } catch (error) {
      console.error('❌ Error al listar archivos:', error);
      throw new Error(`Error al listar archivos: ${error}`);
    }
  }

  // Crear carpeta si no existe
  async createFolderIfNotExists(folderPath: string = sharePointConfig.folderPath): Promise<void> {
    try {
      // Intentar obtener la carpeta
      await this.graphClient
        .api(`/sites/${sharePointConfig.siteId}/drive/root:/${folderPath}`)
        .get();
      
      console.log('✅ La carpeta ya existe');
    } catch (error) {
      // Si no existe, crearla
      try {
        const folderName = folderPath.split('/').pop();
        const parentPath = folderPath.replace(`/${folderName}`, '');
        
        await this.graphClient
          .api(`/sites/${sharePointConfig.siteId}/drive/root:/${parentPath}:/children`)
          .post({
            name: folderName,
            folder: {},
            '@microsoft.graph.conflictBehavior': 'rename'
          });
        
        console.log('✅ Carpeta creada exitosamente');
      } catch (createError) {
        console.error('❌ Error al crear carpeta:', createError);
        throw new Error(`Error al crear carpeta: ${createError}`);
      }
    }
  }
}
