export interface MediaSinal {
  idSinal: number;
  nomeSinal: string;
  valorMedio: number;
  agentesNormais: number;
  agentesAtencao: number;
  tendencia: string;
}

export interface MediaAgentesResponse {
  numeroAgentes: number;
  proximaAvaliacao: string;
  valorNedias: MediaSinal[];
}
