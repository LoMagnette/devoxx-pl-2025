import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {Sheep} from '../models/sheep';

@Injectable({
  providedIn: 'root'
})
export class SheepService {

  private http = inject<HttpClient>(HttpClient)
  searchText = signal('');

  constructor() {

  }

  getSheep(){
    return httpResource<Sheep[]>(() => `http://localhost:8080/sheeps?name=${this.searchText()}`, {defaultValue:[]});
  }
}
