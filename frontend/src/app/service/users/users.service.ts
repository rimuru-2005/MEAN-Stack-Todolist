import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface UpgradePayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  upgradeGuest(payload: UpgradePayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/upgrade`, payload, {
      withCredentials: true,
    });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }

  promoteUser(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/promote/${id}`, {}, {
      withCredentials: true,
    });
  }

  demoteUser(id: string, demoteKey: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/demote/${id}`, {}, {
      headers: new HttpHeaders({
        'demote-key': demoteKey,
      }),
      withCredentials: true,
    });
  }
}
