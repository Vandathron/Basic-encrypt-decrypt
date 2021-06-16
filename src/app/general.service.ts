import { environment } from './../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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


  public createCity(city: ICity): Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/City/Create`, city);
  }

  public createBulkCity(cities: ICity[]): Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/City/BulkCreate`, cities);
  }

  public updateCity(cityToUpdate: ICity) : Observable<any>{
    const params = new HttpParams().set("id", cityToUpdate.id?.toString());
    return this.httpClient.patch(`${this.apiUrl}/City/Update`, cityToUpdate, {params});
  }

  public getAllCities(): Observable<IBaseResponse<ICity[]>>{
    return this.httpClient.get<IBaseResponse<ICity[]>>(`${this.apiUrl}/City/All`);
  }

  public createRoad(city: IRoad): Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/Road/Create`, city);
  }

  public updateRoad(roadtoUpdate: IRoad) : Observable<any>{
    const params = new HttpParams().set("id", roadtoUpdate.id.toString());
    return this.httpClient.patch(`${this.apiUrl}/Road/Update`, roadtoUpdate, {params});
  }

  public getAllRoads(): Observable<IBaseResponse<IRoad[]>>{
    return this.httpClient.get<IBaseResponse<IRoad[]>>(`${this.apiUrl}/Road/All`);
  }

  public findLogisticCenter(): Observable<IBaseResponse<number>>{
    return this.httpClient.get<IBaseResponse<number>>(`${this.apiUrl}/LogisticsCenter/Retrieve`);
  }

  private apiUrl: string = environment.ApiRoute;
}
