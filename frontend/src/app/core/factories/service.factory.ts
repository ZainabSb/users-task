import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Base service interface
export interface IApiService {
  getUsers(): Observable<any[]>;
  createUser(userData: any): Observable<any>;
}

// Factory interface
export interface IServiceFactory {
  createApiService(): IApiService;
}

// Concrete implementation
@Injectable({
  providedIn: 'root'
})
export class UsersApiService implements IApiService {
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/list`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/create`, userData);
  }
}

// Factory implementation
@Injectable({
  providedIn: 'root'
})
export class ServiceFactory implements IServiceFactory {
  constructor(private http: HttpClient) {}

  createApiService(): IApiService {
    return new UsersApiService(this.http);
  }
}