import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth-service';
import { map, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = environment.apiUrl + '/files';
  private imageCache = new Map<string, string>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  uploadFile(file:File): Observable<{progress:number;uuid?:string}>{
    const formData = new FormData();
    formData.append('file', file);

    const isVideo = file.type.startsWith('video/');
    const uploadUrl = isVideo ? `${this.apiUrl}/upload/video` : `${this.apiUrl}/upload/image`;

    const req = new HttpRequest('POST', uploadUrl, formData,{
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map(event =>{
        if(event.type === HttpEventType.UploadProgress){
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          return {progress};
        }
        else if(event.type === HttpEventType.Response){
          const body = event.body as any;
          return {progress:100, uuid:body?.uuid || ''};
        }
        return {progress: 0};
      })
    )
  }


  getMediaUrl(mediaValue: any, type: 'image' | 'video', options?: {
  userCache?: boolean;
}): string | null {
  let value = mediaValue;

  if (type === 'image' && mediaValue && typeof mediaValue === 'object' && mediaValue.poster) {
    value = mediaValue.poster;
  }

  if (!value) return null;

  // ✅ If it's already a full URL, extract just the UUID (last segment)
  if (value.startsWith('http') || value.includes('/')) {
    value = value.split('/').pop(); // extracts just the UUID
  }

  if (!value) return null;

  if (value.startsWith('blob:') || value.startsWith('data:')) {
    return value;
  }

  const token = this.authService.getToken();
  if (!token) return null;

  const uuid = value;
  const authenticatedUrl = `${this.apiUrl}/${type}/${uuid}?token=${token}`;

  if (options?.userCache && type === 'image') {
    this.imageCache.set(uuid, authenticatedUrl);
  }

  return authenticatedUrl;
}

}
