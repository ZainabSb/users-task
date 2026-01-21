import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/list`);
  }

  createUser(userData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    username: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/create`, userData);
  }
}
