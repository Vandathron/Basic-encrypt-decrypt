import { GeneralInterceptorService } from './general-interceptor.service';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';

import {BrowserAnimationsModule}from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    NgxGraphModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],

  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: GeneralInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
