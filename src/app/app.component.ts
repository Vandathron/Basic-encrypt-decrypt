import { GeneralService } from './general.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICity } from './ICity';
import {map} from 'rxjs/operators';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IRoad } from './IRoad';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{

  constructor(private generalService: GeneralService, private rd: Renderer2){

  }

  ngOnInit(){

  }


  public onFileUpload(file){
    this.fileToUpload = file.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(this.fileToUpload);
    reader.onload = () => {
      this.uploadedImage = reader.result;
    }

  }

  public encryptImage(): void {
    this.isLoading = true;
    this.loadingText = "Encrypting, Please wait";
    let f = new FormData();
    f.append("file",this.fileToUpload);
    this.generalService.encryptImage(f).pipe(
      map( x => {
        x.headers.keys().map( (key) => console.log(`${key}: ${x.headers.get(key)}`));
        console.log(x);
        console.log("hello");
        console.log(x.headers.get('x-auth-token'));
        console.log(x.headers.keys());
        // console.log(this.currentKey);
        let reader = new FileReader();
        this.imageOutput = x.body;
        this.isLoading = false;
        this.loadingText = "Encrypted. Done";
      })
    ).subscribe(x => {}, (err: HttpErrorResponse) => {
      console.log(err);
      this.loadingText = err.statusText;
      this.isLoading = false;
    })
  }

  public decryptImage(): void {
    this.isLoading = true;
    this.loadingText = "Decrypting, please wait";
    let f = new FormData();
    f.append("file",this.fileToUpload);
    f.append("key", this.currentKey);
    this.generalService.decryptImage(f).pipe(
      map( x => {
        let reader = new FileReader();
        reader.readAsDataURL(x);
        reader.onload = () => {
          this.imageOutput = reader.result;
        }
        this.isLoading = false;
        this.loadingText = "Decrypted. Done";
      })
    ).subscribe(x => {}, (err: HttpErrorResponse) => {
      console.log(err);
      this.loadingText = err.statusText;
      this.isLoading = false;
    })
  }

  public downloadOutput(): void {
    const link = this.rd.createElement("a");
    link.download = "encryptedImage";
    link.href = (window.webkitURL || window.URL).createObjectURL(this.imageOutput);
    link.click();
    console.log("downloaded");
  }
  public currentKey: string = 'beed4200c58eecc2ace10a968c9d23fd';

  public fileToUpload;

  public uploadedImage;

  public imageOutput;

  public isLoading: boolean = false;

  public loadingText: string = '';

}

