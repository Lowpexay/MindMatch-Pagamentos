import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RotinaResponse } from '../../modules/rotinas/models/rotina.interface';

@Injectable({
  providedIn: 'root',
})
export class RotinasService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  buscarRotinaPorId(id: number): Observable<RotinaResponse> {
    return this.http.get<RotinaResponse>(`${this.apiUrl}/agentes/rotina/id/${id}`);
  }
}
