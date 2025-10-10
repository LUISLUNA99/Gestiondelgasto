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
  mimeType?: string;
  isImage?: boolean;
  thumbnailUrl?: string;
}

// Servicio de SharePoint
export class SharePointService {
  private graphClient: Client;
  private siteId: string = '';

  constructor(accessToken: string) {
    this.graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  // Inicializar el servicio obteniendo el Site ID dinámicamente
  async init(): Promise<void> {
    try {
      console.log('🔄 Inicializando SharePoint Service...');
      const siteName = sharePointConfig.siteId || 'gestiongasto';
      
      // Buscar el sitio por su nombre
      const response = await this.graphClient
        .api('/sites')
        .query({ search: siteName })
        .get();

      if (response && response.value && response.value.length > 0) {
        this.siteId = response.value[0].id;
        console.log(`✅ Site ID para '${siteName}' obtenido: ${this.siteId}`);
      } else {
        throw new Error(`No se pudo encontrar el sitio de SharePoint con el nombre: ${siteName}`);
      }
    } catch (error) {
      console.error('❌ Error al inicializar SharePoint Service:', error);
      throw error;
    }
  }

  // Construye ruta año/mes/solicitud
  private buildNestedPath(baseFolder: string, solicitudId?: string): string {
    const now = new Date()
    const year = String(now.getFullYear())
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const safeBase = baseFolder.replace(/^[\/]+|[\/]+$/g, '')
    if (solicitudId) {
      return `${safeBase}/${year}/${month}/${solicitudId}`
    }
    return `${safeBase}/${year}/${month}`
  }

  // Subir archivo a SharePoint
  async uploadFile(file: File, folderPath: string = sharePointConfig.folderPath, solicitudId?: string): Promise<SharePointFile> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    try {
      console.log('📤 Subiendo archivo a SharePoint:', file.name);
      // Crear estructura año/mes/solicitud
      const nested = this.buildNestedPath(folderPath, solicitudId)
      await this.createFolderIfNotExists(nested)

      // Crear el nombre único del archivo
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${nested}/${fileName}`;
      
      // Convertir archivo a ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Subir archivo usando Microsoft Graph
      const uploadResult = await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${filePath}:/content`)
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
  async uploadMultipleFiles(files: File[], folderPath: string = sharePointConfig.folderPath, solicitudId?: string): Promise<SharePointFile[]> {
    const results: SharePointFile[] = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, folderPath, solicitudId);
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
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    try {
      const file = await this.graphClient
        .api(`/sites/${this.siteId}/drive/items/${fileId}`)
        .get();

      // Intentar obtener una miniatura si existe
      let thumbnailUrl: string | undefined
      try {
        const thumbs = await this.graphClient
          .api(`/sites/${this.siteId}/drive/items/${fileId}/thumbnails`)
          .get()
        const t = (thumbs?.value?.[0]) || {}
        thumbnailUrl = t?.medium?.url || t?.small?.url || t?.large?.url
      } catch (_) {
        // ignorar errores de miniaturas
      }
      
      return {
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        size: file.size,
        createdDateTime: file.createdDateTime,
        mimeType: file?.file?.mimeType,
        isImage: typeof file?.file?.mimeType === 'string' ? file.file.mimeType.startsWith('image/') : undefined,
        thumbnailUrl,
      };
    } catch (error) {
      console.error('❌ Error al obtener archivo:', error);
      throw new Error(`Error al obtener archivo: ${error}`);
    }
  }

  // Eliminar archivo
  async deleteFile(fileId: string): Promise<void> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    try {
      await this.graphClient
        .api(`/sites/${this.siteId}/drive/items/${fileId}`)
        .delete();
      
      console.log('✅ Archivo eliminado exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar archivo:', error);
      throw new Error(`Error al eliminar archivo: ${error}`);
    }
  }

  // Listar archivos en una carpeta
  async listFiles(folderPath: string = sharePointConfig.folderPath): Promise<SharePointFile[]> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    try {
      const response = await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${folderPath}:/children`)
        .query({ $expand: 'thumbnails' })
        .get();
      
      return response.value.map((file: any) => ({
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        size: file.size,
        createdDateTime: file.createdDateTime,
        mimeType: file?.file?.mimeType,
        isImage: typeof file?.file?.mimeType === 'string' ? file.file.mimeType.startsWith('image/') : undefined,
        thumbnailUrl: (file?.thumbnails?.[0]?.medium?.url) || (file?.thumbnails?.[0]?.small?.url) || (file?.thumbnails?.[0]?.large?.url),
      }));
    } catch (error) {
      console.error('❌ Error al listar archivos:', error);
      throw new Error(`Error al listar archivos: ${error}`);
    }
  }

  // Crear carpeta si no existe (recursivamente)
  async createFolderIfNotExists(folderPath: string = sharePointConfig.folderPath): Promise<void> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
      
    try {
      // Intentar obtener la carpeta
      await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${folderPath}`)
        .get();
      
      console.log('✅ La carpeta ya existe:', folderPath);
    } catch (error) {
      // Si no existe, crear recursivamente
      const pathParts = folderPath.split('/').filter(part => part.length > 0);
      let currentPath = '';
      
      for (let i = 0; i < pathParts.length; i++) {
        currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : pathParts[i];
        
        try {
          // Verificar si la carpeta actual existe
          await this.graphClient
            .api(`/sites/${this.siteId}/drive/root:/${currentPath}`)
            .get();
          
          console.log('✅ La carpeta ya existe:', currentPath);
        } catch (folderError) {
          // Crear la carpeta actual
          try {
            const parentPath = i === 0 ? '' : pathParts.slice(0, i).join('/');
            const apiPath = parentPath 
              ? `/sites/${this.siteId}/drive/root:/${parentPath}:/children`
              : `/sites/${this.siteId}/drive/root/children`;
            
            await this.graphClient
              .api(apiPath)
              .post({
                name: pathParts[i],
                folder: {},
                '@microsoft.graph.conflictBehavior': 'rename'
              });
            
            console.log('✅ Carpeta creada exitosamente:', currentPath);
          } catch (createError) {
            console.error('❌ Error al crear carpeta:', currentPath, createError);
            throw new Error(`Error al crear carpeta ${currentPath}: ${createError}`);
          }
        }
      }
    }
  }
}
