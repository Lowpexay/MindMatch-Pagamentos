import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PessoalService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  buscarAgentePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/agentes/sinais/id/${id}`);
  }
}
