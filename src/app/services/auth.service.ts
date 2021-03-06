import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://identitytoolkit.googleapis.com/v1/';
  private key = 'AIzaSyBBxsQNK2r5yzGYWREN3fxgDcrx3JOaivs';
  private token:string;
  constructor(private http:HttpClient) { }

  logout(){
    localStorage.removeItem('idToken');
  }
  
  newUser(user:UserModel){
    const userData = {
      email: user.email,
      password: user.password,
      returnSecureToken:true
    }

    return this.http.post(`${this.url}accounts:signUp?key=${this.key}`,userData).pipe(map(res =>{
      this.saveToken(res['idToken']);
      return res;
    }));
  }
  
  login(user:UserModel){
    const userData = {
      email: user.email,
      password: user.password,
      returnSecureToken:true
    }

    return this.http.post(`${this.url}accounts:signInWithPassword?key=${this.key}`,userData).pipe(map(res =>{
      this.saveToken(res['idToken']);
      return res;
    }));
  }

  private saveToken(idToken:string){
    this.token = idToken;
    localStorage.setItem('idToken',idToken)
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expire', hoy.getTime().toString());
  }

  private getToken(){
     if (localStorage.getItem('idToken')) {
      this.token = localStorage.getItem('idToken');
     }else{
       this.token = '';
     }
     return this.token;
  }

  isAutecticated():boolean{
    this.getToken();
    if (this.token.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expira);
    if(expireDate   > new Date()){
      return true;
    }else{
      return false;
    }
  }
}


// Crear nuevo usuario
// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

// Entrar
// https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]