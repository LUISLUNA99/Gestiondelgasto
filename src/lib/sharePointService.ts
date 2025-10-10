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

  // Codifica cada segmento del path (OneDrive/SharePoint requieren codificación segura)
  private encodePath(path: string): string {
    return path
      .split('/')
      .filter(Boolean)
      .map(segment => encodeURIComponent(segment))
      .join('/');
  }

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
      console.log('📤 ========== INICIO SUBIDA DE ARCHIVO ==========');
      console.log('📄 Archivo:', file.name);
      console.log('📏 Tamaño:', file.size, 'bytes');
      console.log('📁 folderPath recibido:', folderPath);
      console.log('🔑 solicitudId recibido:', solicitudId);
      console.log('🏢 Site ID:', this.siteId);
      
      // Crear estructura año/mes/solicitud
      const nested = this.buildNestedPath(folderPath, solicitudId)
      console.log('📂 Nested folder path calculado:', nested);
      console.log('🔨 Intentando crear carpeta...');
      await this.createFolderIfNotExists(nested)
      console.log('✅ Carpeta creada/verificada');


      // Crear el nombre único del archivo (más simple)
      const timestamp = Date.now().toString().slice(-8); // Solo últimos 8 dígitos
      
      // Limpiar el nombre del archivo original (remover timestamps existentes)
      const originalName = file.name;
      const cleanName = originalName.replace(/^\d+-/g, ''); // Remover timestamps al inicio
      
      const fileName = `${timestamp}-${cleanName}`;
      const filePath = `${nested}/${fileName}`;
      
      console.log('🔤 Archivo original:', originalName);
      console.log('🧹 Nombre limpio:', cleanName);
      console.log('✨ Nombre final:', fileName);
      console.log('🗂️ Full file path (antes de encoding):', filePath);
      
      // Convertir archivo a ArrayBuffer
      console.log('🔄 Convirtiendo archivo a ArrayBuffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('✅ ArrayBuffer creado, tamaño:', arrayBuffer.byteLength, 'bytes');
      
      // Subir archivo usando Microsoft Graph
      const encodedFilePath = this.encodePath(filePath)
      console.log('🔐 Ruta codificada:', encodedFilePath);
      console.log('📡 API endpoint:', `/sites/${this.siteId}/drive/root:/${encodedFilePath}:/content`);
      console.log('🚀 Iniciando PUT request a Microsoft Graph...');
      
      const uploadResult = await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${encodedFilePath}:/content`)
        .put(arrayBuffer);
      
      console.log('🎉 Archivo subido exitosamente!');
      console.log('📋 Respuesta de SharePoint:', uploadResult);
      console.log('✅ Nombre del archivo en SharePoint:', uploadResult.name);
      console.log('🔗 URL del archivo:', uploadResult.webUrl);
      console.log('📤 ========== FIN SUBIDA DE ARCHIVO ==========');
      
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
      const encodedFolder = this.encodePath(folderPath)
      const response = await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${encodedFolder}:/children`)
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

  // Buscar carpeta de una solicitud sin conocer año/mes
  async findSolicitudFolderId(solicitudId: string, baseFolder: string = sharePointConfig.folderPath): Promise<string | null> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    const targetName = `Solicitud-${solicitudId}`
    try {
      // 1) Buscar carpeta con el nombre exacto 'Solicitud-{uuid}'
      const searchSolicitud = await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${baseFolder}:/search(q='${encodeURIComponent(targetName)}')`)
        .get()
      let folderItem = (searchSolicitud?.value || []).find((it: any) => it?.name === targetName && !!it.folder)
      if (folderItem?.id) return folderItem.id

      // 2) Buscar carpeta con el nombre exacto '{uuid}' (estructura anterior)
      const searchUuid = await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${baseFolder}:/search(q='${encodeURIComponent(solicitudId)}')`)
        .get()
      folderItem = (searchUuid?.value || []).find((it: any) => !!it.folder && (it?.name === solicitudId || it?.name === targetName || (typeof it?.name === 'string' && it.name.includes(solicitudId))))
      return folderItem?.id || null
    } catch (error) {
      console.error('❌ Error al buscar carpeta de solicitud:', error)
      return null
    }
  }

  // Listar archivos por solicitud (independiente del año/mes)
  async listFilesForSolicitud(solicitudId: string, baseFolder: string = sharePointConfig.folderPath): Promise<SharePointFile[]> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    const folderId = await this.findSolicitudFolderId(solicitudId, baseFolder)
    if (!folderId) return []
    try {
      const response = await this.graphClient
        .api(`/sites/${this.siteId}/drive/items/${folderId}/children`)
        .query({ $expand: 'thumbnails' })
        .get()
      return (response?.value || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        size: file.size,
        createdDateTime: file.createdDateTime,
        mimeType: file?.file?.mimeType,
        isImage: typeof file?.file?.mimeType === 'string' ? file.file.mimeType.startsWith('image/') : undefined,
        thumbnailUrl: (file?.thumbnails?.[0]?.medium?.url) || (file?.thumbnails?.[0]?.small?.url) || (file?.thumbnails?.[0]?.large?.url),
      }))
    } catch (error) {
      console.error('❌ Error al listar archivos de la solicitud:', error)
      return []
    }
  }

  // Crear carpeta si no existe (recursivamente)
  async createFolderIfNotExists(folderPath: string = sharePointConfig.folderPath): Promise<void> {
    if (!this.siteId) throw new Error("SharePoint Service no inicializado. Falta Site ID.");
    
    console.log('📁 ========== CREAR/VERIFICAR CARPETA ==========');
    console.log('📂 Ruta de carpeta solicitada:', folderPath);
      
    try {
      // Intentar obtener la carpeta
      const encoded = this.encodePath(folderPath)
      console.log('🔐 Ruta codificada:', encoded);
      console.log('🔍 Verificando si existe...');
      
      await this.graphClient
        .api(`/sites/${this.siteId}/drive/root:/${encoded}`)
        .get();
      
      console.log('✅ La carpeta ya existe:', folderPath);
      console.log('📁 ========== FIN VERIFICACIÓN ==========');
    } catch (error) {
      console.log('⚠️ Carpeta no existe, creando estructura completa...');
      // Si no existe, crear recursivamente
      const pathParts = folderPath.split('/').filter(part => part.length > 0);
      console.log('🔨 Partes de la ruta:', pathParts);
      let currentPath = '';
      
      for (let i = 0; i < pathParts.length; i++) {
        currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : pathParts[i];
        console.log(`\n🔄 Procesando parte ${i+1}/${pathParts.length}: "${pathParts[i]}"`);
        console.log('📍 Ruta acumulada:', currentPath);
        
        try {
          // Verificar si la carpeta actual existe
          const encCur = this.encodePath(currentPath)
          await this.graphClient
            .api(`/sites/${this.siteId}/drive/root:/${encCur}`)
            .get();
          
          console.log('✅ Ya existe:', currentPath);
        } catch (folderError) {
          // Crear la carpeta actual
          console.log('⚠️ No existe, creando...');
          try {
            const parentPath = i === 0 ? '' : pathParts.slice(0, i).join('/');
            const apiPath = parentPath 
              ? `/sites/${this.siteId}/drive/root:/${this.encodePath(parentPath)}:/children`
              : `/sites/${this.siteId}/drive/root/children`;
            
            console.log('👉 Parent path:', parentPath || '[raíz]');
            console.log('🔗 API path:', apiPath);
            console.log('📝 Creando carpeta con nombre:', pathParts[i]);
            
            const result = await this.graphClient
              .api(apiPath)
              .post({
                name: pathParts[i],
                folder: {},
                '@microsoft.graph.conflictBehavior': 'rename'
              });
            
            console.log('🎉 Carpeta creada:', result.name);
            console.log('✅ Carpeta creada exitosamente:', currentPath);
          } catch (createError: any) {
            console.error('❌ Error al crear carpeta:', currentPath);
            console.error('❌ Detalles del error:', createError);
            console.error('❌ Mensaje:', createError?.message);
            throw new Error(`Error al crear carpeta ${currentPath}: ${createError}`);
          }
        }
      }
      console.log('📁 ========== FIN CREACIÓN DE ESTRUCTURA ==========');
    }
  }
}
