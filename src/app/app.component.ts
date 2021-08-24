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
    this.isEncryptionMode = true;
    this.isLoading = true;
    this.loadingText = "Encrypting, Please wait";
    let f = new FormData();
    f.append("file",this.fileToUpload);
    this.generalService.encryptImage(f).pipe(
      map( x => {
        this.currentKey = x.headers.get('key') as string;
        localStorage.setItem('currentKey', this.currentKey);
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
    this.isEncryptionMode = false;
    this.isLoading = true;
    this.loadingText = "Decrypting, please wait";
    let f = new FormData();
    f.append("file",this.fileToUpload);
    f.append("key", localStorage.getItem('currentKey') as string);
    this.generalService.decryptImage(f).pipe(
      map( x => {
        let reader = new FileReader();
        reader.readAsDataURL(x.body as any);
        reader.onload = () => {
          this.imageOutput = reader.result;
          this.uploadedImage = reader.result;
          console.log(this.uploadedImage);
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
    link.download = "EncryptedImage";
    if(this.isEncryptionMode){
      link.href = (window.webkitURL || window.URL).createObjectURL(this.imageOutput);
    link.click();
    }else {
      var a = document.createElement("a"); //Create <a>
      a.href =  this.uploadedImage; //Image Base64 Goes here
      let ext = '';
      for(let i = 11; i < 16; i++){
        if((this.uploadedImage as string)[i] != ';') ext = `${ext}${this.uploadedImage[i]}`
        else break;
      }
      a.download = `DecryptedImage.${ext}`; //File name Here
      a.click();
    }
  }

  public isEncryptionMode = true;
  public currentKey: string = '';

  public fileToUpload;

  public uploadedImage;

  public imageOutput;

  public isLoading: boolean = false;

  public loadingText: string = '';

}

