import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaAgentesResponse } from '../../modules/sinaisVitais/models/sinais-vitais.interface';

@Injectable({
  providedIn: 'root',
})
export class SinaisVitaisService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  buscarMediaSinais(): Observable<MediaAgentesResponse> {
    return this.http.get<MediaAgentesResponse>(`${this.apiUrl}/agentes/sinais/media`);
  }
}
