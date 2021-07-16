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

  public encryptImage(file: FormData){
    return this.httpClient.post(`${this.apiUrl}/encrypt`, file, { responseType: "blob" as any, observe: 'response'});
  }

  public decryptImage(encryptedImage: FormData){
    const params = new HttpParams().set("key", "Value");
    return this.httpClient.post(`${this.apiUrl}/decrypt`, encryptedImage, {responseType:'blob' as any, observe: 'response'});
  }


  private apiUrl: string = environment.ApiRoute;
}
