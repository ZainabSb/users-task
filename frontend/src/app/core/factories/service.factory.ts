import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../users.service';

export interface IApiService {
  getUsers(): Observable<User[]>;
  createUser(userData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    username: string;
    password: string;
  }): Observable<User>;
}

export interface IServiceFactory {
  createApiService(): IApiService;
}

@Injectable({
  providedIn: 'root'
})
export class UsersApiService implements IApiService {
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

@Injectable({
  providedIn: 'root'
})
export class ServiceFactory implements IServiceFactory {
  private apiService: IApiService | null = null;

  constructor(private http: HttpClient) {}

  createApiService(): IApiService {
    if (!this.apiService) {
      this.apiService = new UsersApiService(this.http);
    }
    return this.apiService;
  }
}