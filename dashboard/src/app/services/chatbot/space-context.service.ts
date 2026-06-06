import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SpaceMissionData {
  id: number;
  nome: string;
  tempo: number;
}

export interface SpaceAgentData {
  id: number;
  nome: string;
  especialidade: string;
  ultimaRevisao: string;
  descanso: number;
  status: 'CRITICO' | 'ATENCAO' | 'NORMAL';
  missaoId?: number | null;
}

export interface HealthSignalData {
  id: number;
  nome: string;
  valor: string;
  categoria: 'MENTAL' | 'FISICO';
  status: 'CRITICO' | 'ATENCAO' | 'NORMAL';
  agenteId: number;
}

export interface SpaceTaskData {
  id: number;
  nome: string;
  tipo: string;
  horario: string;
  prioridade: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  status: 'CONCLUIDO' | 'ANDAMENTO' | 'PENDENTE';
  agenteId: number;
}

export interface SpaceCrewStats {
  totalAgentes: number;
  agentesNormais: number;
  agentesAtencao: number;
  agentesCriticos: number;
  sinaisCriticos: number;
  tarefasPendentes: number;
  tarefasAndamento: number;
  tarefasConcluidas: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpaceContextService {
  private missionsSubject = new BehaviorSubject<SpaceMissionData[]>(this.getDefaultMissions());
  private agentsSubject = new BehaviorSubject<SpaceAgentData[]>(this.getDefaultAgents());
  private signalsSubject = new BehaviorSubject<HealthSignalData[]>(this.getDefaultSignals());
  private tasksSubject = new BehaviorSubject<SpaceTaskData[]>(this.getDefaultTasks());

  public missions$ = this.missionsSubject.asObservable();
  public agents$ = this.agentsSubject.asObservable();
  public signals$ = this.signalsSubject.asObservable();
  public tasks$ = this.tasksSubject.asObservable();

  updateMissions(missions: SpaceMissionData[]): void {
    this.missionsSubject.next(missions);
  }

  updateAgents(agents: SpaceAgentData[]): void {
    this.agentsSubject.next(agents);
  }

  updateSignals(signals: HealthSignalData[]): void {
    this.signalsSubject.next(signals);
  }

  updateTasks(tasks: SpaceTaskData[]): void {
    this.tasksSubject.next(tasks);
  }

  getMissions(): SpaceMissionData[] {
    return this.missionsSubject.value;
  }

  getAgents(): SpaceAgentData[] {
    return this.agentsSubject.value;
  }

  getSignals(): HealthSignalData[] {
    return this.signalsSubject.value;
  }

  getTasks(): SpaceTaskData[] {
    return this.tasksSubject.value;
  }

  findAgentByName(name: string): SpaceAgentData | undefined {
    const normalized = name.toLowerCase();
    return this.getAgents().find(agent => agent.nome.toLowerCase().includes(normalized));
  }

  getSignalsByAgent(agentId: number): HealthSignalData[] {
    return this.getSignals().filter(signal => signal.agenteId === agentId);
  }

  getTasksByAgent(agentId: number): SpaceTaskData[] {
    return this.getTasks().filter(task => task.agenteId === agentId);
  }

  getCriticalSignals(): HealthSignalData[] {
    return this.getSignals().filter(signal => signal.status === 'CRITICO');
  }

  getStats(): SpaceCrewStats {
    const agents = this.getAgents();
    const signals = this.getSignals();
    const tasks = this.getTasks();

    return {
      totalAgentes: agents.length,
      agentesNormais: agents.filter(agent => agent.status === 'NORMAL').length,
      agentesAtencao: agents.filter(agent => agent.status === 'ATENCAO').length,
      agentesCriticos: agents.filter(agent => agent.status === 'CRITICO').length,
      sinaisCriticos: signals.filter(signal => signal.status === 'CRITICO').length,
      tarefasPendentes: tasks.filter(task => task.status === 'PENDENTE').length,
      tarefasAndamento: tasks.filter(task => task.status === 'ANDAMENTO').length,
      tarefasConcluidas: tasks.filter(task => task.status === 'CONCLUIDO').length
    };
  }

  getFormattedContext(): string {
    const missions = this.getMissions();
    const agents = this.getAgents();
    const signals = this.getSignals();
    const tasks = this.getTasks();
    const stats = this.getStats();

    const missionsText = missions
      .map(mission => `- ${mission.nome} (id ${mission.id}, duracao ${mission.tempo} horas)`)
      .join('\n');

    const agentsText = agents
      .map(agent => {
        const mission = missions.find(item => item.id === agent.missaoId);
        return `- ${agent.nome} | especialidade: ${agent.especialidade} | status: ${agent.status} | missao: ${mission?.nome || 'sem missao'} | descanso: ${agent.descanso}%`;
      })
      .join('\n');

    const signalsText = signals
      .map(signal => `- ${signal.nome} | agente ${signal.agenteId} | categoria ${signal.categoria} | status ${signal.status} | valor ${signal.valor}`)
      .join('\n');

    const tasksText = tasks
      .map(task => `- ${task.nome} | agente ${task.agenteId} | prioridade ${task.prioridade} | status ${task.status} | horario ${task.horario}`)
      .join('\n');

    return `
CONTEXTO DE TRIPULACAO DO MINDSPACE:

🛰️ ESTATISTICAS GERAIS:
  - Tripulantes em atividade: ${stats.totalAgentes}
  - Tripulantes em condicao normal: ${stats.agentesNormais}
  - Tripulantes sob observacao: ${stats.agentesAtencao}
  - Tripulantes em estado critico: ${stats.agentesCriticos}
  - Sinais de saude em alerta critico: ${stats.sinaisCriticos}
  - Tarefas aguardando execucao: ${stats.tarefasPendentes}
  - Tarefas em andamento: ${stats.tarefasAndamento}
  - Tarefas concluidas: ${stats.tarefasConcluidas}

🚀 MISSOES CADASTRADAS:
${missionsText || '- Nenhuma missao cadastrada'}

👩‍🚀 TRIPULANTES CADASTRADOS:
${agentsText || '- Nenhum tripulante cadastrado'}

🩺 SINAIS DE SAUDE:
${signalsText || '- Nenhum sinal de saude cadastrado'}

🧭 TAREFAS DA EQUIPE:
${tasksText || '- Nenhuma tarefa cadastrada'}
    `.trim();
  }

  private getDefaultMissions(): SpaceMissionData[] {
    return [
      { id: 1, nome: 'Manutencao de Orbita', tempo: 72 },
      { id: 2, nome: 'Exploracao do Setor Aurora', tempo: 48 },
      { id: 3, nome: 'Vigilia da Nave', tempo: 24 }
    ];
  }

  private getDefaultAgents(): SpaceAgentData[] {
    return [
      { id: 1, nome: 'Comandante Orion', especialidade: 'Navegacao', ultimaRevisao: '2026-06-01', descanso: 12, status: 'NORMAL', missaoId: 1 },
      { id: 2, nome: 'Tecnica Vega', especialidade: 'Biomecanica', ultimaRevisao: '2026-06-03', descanso: 24, status: 'ATENCAO', missaoId: 2 },
      { id: 3, nome: 'Analista Luma', especialidade: 'Diagnostico', ultimaRevisao: '2026-05-28', descanso: 8, status: 'CRITICO', missaoId: 3 }
    ];
  }

  private getDefaultSignals(): HealthSignalData[] {
    return [
      { id: 1, nome: 'Oxigenacao', valor: '98%', categoria: 'FISICO', status: 'NORMAL', agenteId: 1 },
      { id: 2, nome: 'Fadiga', valor: '71%', categoria: 'FISICO', status: 'ATENCAO', agenteId: 2 },
      { id: 3, nome: 'Nivel de Stress', valor: '89%', categoria: 'MENTAL', status: 'CRITICO', agenteId: 3 }
    ];
  }

  private getDefaultTasks(): SpaceTaskData[] {
    return [
      { id: 1, nome: 'Revisar painel de propulsao', tipo: 'Manutencao', horario: '2026-06-06T08:00:00', prioridade: 'ALTA', status: 'ANDAMENTO', agenteId: 1 },
      { id: 2, nome: 'Verificar modulo medico', tipo: 'Saude', horario: '2026-06-06T10:30:00', prioridade: 'CRITICA', status: 'PENDENTE', agenteId: 3 },
      { id: 3, nome: 'Atualizar mapa da rota estelar', tipo: 'Navegacao', horario: '2026-06-06T13:45:00', prioridade: 'MEDIA', status: 'CONCLUIDO', agenteId: 2 }
    ];
  }
}