export interface TarefaRotina {
  id: number;
  nome: string;
  tipo: string;
  horario: string;
  prioridade: string;
  status: string;
  idAgente: number;
}

export interface RotinaResponse {
  idAgente: number;
  nomeAgente: string;
  tempoDescanso: number;
  cronograma: TarefaRotina[];
}
