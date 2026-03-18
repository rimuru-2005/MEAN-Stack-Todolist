import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthPayload {
  email: string;
  password: string;
}

interface SignupPayload extends AuthPayload {
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  createGuestSession(): Observable<any> {
    return this.http.post(`${this.apiUrl}/guest`, {}, {
      withCredentials: true,
    });
  }

  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, payload, {
      withCredentials: true,
    });
  }

  login(payload: AuthPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
    });
  }

  createAdmin(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/newadmin`, payload, {
      withCredentials: true,
    });
  }
}
