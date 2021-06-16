import { GeneralService } from './general.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICity } from './ICity';
import {map} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import * as shape from 'd3-shape';
import { IRoad } from './IRoad';
import {Node, ClusterNode, D3Edge, Edge} from '@swimlane/ngx-graph'
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'logistics-FE';

  constructor(private generalService: GeneralService, private fb: FormBuilder){
    this.getAllCities();
    this.getAllRoads();
  }

  ngOnInit(){
    this.cityForm = this.fb.group({
      cities: this.fb.array([this.generateNewCity()])
    });

  }


  public generateNewCity(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  public addCity(): void {
    this.cities = this.cityForm.get("cities") as FormArray;
    this.cities.push(this.generateNewCity());
  }

  public createCity(){
    if((this.cityForm.get("cities") as FormArray).length == 1){
      const city = this.cityForm.get("cities")?.value[0];
      if(city.name != '')this.createSingleCity(city);
    } else {
      this.createManyCities(this.cityForm.get("cities")?.value.filter(x => x.name != ''));
    }
  }

  private createSingleCity(city: ICity){
    this.generalService.createCity(city).pipe(
      map(v => {
        this.getAllCities();
      })
    ).subscribe(x => {}, (err: HttpErrorResponse) => {
      // Handle error
    })
  }

  private createManyCities(cities: ICity[]){
    this.generalService.createBulkCity(cities).pipe(
      map(v => {
        this.getAllCities();

      })
    ).subscribe(x => {}, (err: HttpErrorResponse) => {
      // Handle error
    })
  }

  public updateCity(){
    this.generalService.updateCity(this.cityToUpdate).pipe(
      map(v => {
        this.getAllCities();
      })
    ).subscribe(x => {}, (err: HttpErrorResponse) => {
      // Handle error
    })
  }

  public updateRoad(){
    this.generalService.updateRoad(this.roadToUpdate).pipe(
      map(v => {
        this.getAllCities();
        this.getAllRoads();
      })
    ).subscribe(x => {}, (err: HttpErrorResponse) => {
      // Handle error
    });
  }

  public makeRoad(){
    this.generalService.createRoad({startCityId: this.startCityId, endCityId: this.endCityId, distance: this.distance, id:0}).pipe(
      map(v => {
        this.startCityId = this.endCityId = this.distance = 0;
        this.getAllCities();
        this.getAllRoads();
      })
    ).subscribe(x => (err: HttpErrorResponse) => {
      console.log(err.message);
    });
  }

  private getAllCities(): void {
    this.generalService.getAllCities().pipe(
      map(v => {
        this.allCities = v.data.map(a => {
          return { data: a,color: "#f37925", label: a.name, id : a.id.toString()}
        });
      })
    ).subscribe(v =>{}, (err: HttpErrorResponse) => {
      // handle errors
    });
  }

  private getAllRoads(): void {
    this.generalService.getAllRoads().pipe(
      map(v => {
        if(v.status != false || v.errorMessage != null){
          this.allRoads = v.data.map(x => {
            return {data: x, source: x.startCityId.toString(), target: x.endCityId.toString(), id : `b-${x.id}`, label: x.distance.toString()}
          });
        }
      })
    ).subscribe(v =>{}, (err: HttpErrorResponse) => {
      // handle errors
    })
  }

  public findLogisticCenter(): void{
    this.generalService.findLogisticCenter().pipe(
      map(v => {
        this.allCities.map((x:any) => {
          if(v.data.toString() == x.id){
            x.color = "#FF0000";
            this.update$.next(true);
            return;
          }
        });
      })
    ).subscribe();
  }

  public onCityClicked(event): void{
    this.cityToUpdate = event.data;
  }

  public onRoadClicked(event): void{
    console.log(event.data);
    this.roadToUpdate = event.data;
  }

  public get cityFormGroup(){
    return this.cityForm.get('cities') as FormArray;
  }

  public setStartCity(id){
    this.startCityId = id;
  }

  public setEndCity(id){
    this.endCityId = id;
  }

  public update$: Subject<boolean> = new Subject();

  public cityToUpdate: ICity = {name: '', id: 0, tag: ''};
  public roadToUpdate: IRoad = {startCityId:0, endCityId: 0, id: 0, distance: 0};

  public startCityId: number = 0;
  public endCityId: number = 0;
  public distance: number = 0;

  public allCities: Node[] = [];
  public allRoads: Edge[] = [];

  public cityForm: FormGroup = new FormGroup({});
  public cities: FormArray = new FormArray([]);

}

