import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICity } from './ICity';
import { IRoad } from './IRoad';
import { IBaseResponse } from './IBaseResponse';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public encryptImage(file: FormData): Observable<HttpResponse<any>>{
    return this.httpClient.post<HttpResponse<any>>(`${this.apiUrl}/encrypt`, file, {responseType:'blob' as any, observe: 'response', headers: ({'Access-Control-Expose-Headers': 'Set-Cookie'})});
  }

  public decryptImage(encryptedImage: FormData): Observable<any>{
    const params = new HttpParams().set("key", "Value");
    return this.httpClient.post<any>(`${this.apiUrl}/decrypt`, encryptedImage, {responseType:'blob' as any});
  }


  private apiUrl: string = environment.ApiRoute;
}
