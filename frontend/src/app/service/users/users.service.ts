import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CurrentUser {
  _id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
}

interface CurrentUserResponse {
  success: boolean;
  data: CurrentUser;
}

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

  getCurrentUser(): Observable<CurrentUser> {
    return this.http
      .get<CurrentUserResponse>(`${this.apiUrl}/me`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  deleteCurrentUser(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/delete`, {}, {
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
