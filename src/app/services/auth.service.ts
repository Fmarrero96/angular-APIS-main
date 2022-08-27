import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from './../../environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }


  login(email:string, password:string){
    return this.http.post<Auth>(`${this.apiUrl}/login`,{email,password}).pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    );
  }


  getProfile(){
    /*let headers = new HttpHeaders();
    headers.set('Authorization', `Bearer ${token}`);*/ // funciona para cuando es mas dinamico
    return this.http.get<User>(`${this.apiUrl}/profile`)
     // headers: { lo recibe el interceptor
       // Authorization: `Bearer ${token}`,
        //'content-type': 'aplication/token'
      
    
  }


  loginAndGet(email:string, password:string){
    return this.login(email,password).pipe(
      switchMap(() => this.getProfile())
    )
  }
}
