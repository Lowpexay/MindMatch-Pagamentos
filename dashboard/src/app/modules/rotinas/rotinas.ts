import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppModule } from '../../app';
import { RotinasService } from '../../services/rotinas/rotinas';
import { RotinaResponse, TarefaRotina } from './models/rotina.interface';

@Component({
  selector: 'app-rotinas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rotinas.html',
  styleUrls: ['./rotinas.less'],
})
export class RotinasComponent implements OnInit, OnDestroy {
  rotina: RotinaResponse | null = null;
  mensagem: string = '';
  carregando: boolean = false;
  dataAtual: string = '';
  horaUtc: string = '';

  private clockInterval?: ReturnType<typeof setInterval>;

  constructor(
    private rotinasService: RotinasService,
    public global: AppModule,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.global.logou !== true) {
      this.router.navigate(['']);
      return;
    }

    if (!this.global.idAgenteSelecionado) {
      this.router.navigate(['/pessoal']);
      return;
    }

    this.atualizarRelogio();
    this.clockInterval = setInterval(() => this.atualizarRelogio(), 1000);
    this.carregarRotina();
  }

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  carregarRotina() {
    const id = this.global.idAgenteSelecionado;
    if (!id) {
      this.router.navigate(['/pessoal']);
      return;
    }

    this.carregando = true;
    this.mensagem = '';

    this.rotinasService.buscarRotinaPorId(id).subscribe({
      next: (dados) => {
        this.rotina = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar rotina:', erro);
        this.mensagem = 'Rotina não encontrada. Verifique o ID e tente novamente.';
        this.rotina = null;
        this.carregando = false;
      },
    });
  }

  get cronograma(): TarefaRotina[] {
    return this.rotina?.cronograma ?? [];
  }

  get concluidos(): number {
    return this.cronograma.filter((t) => t.status === 'CONCLUIDO').length;
  }

  get emAndamento(): number {
    return this.cronograma.filter((t) => t.status === 'ANDAMENTO').length;
  }

  get pendentes(): number {
    return this.cronograma.filter((t) => t.status === 'PENDENTE').length;
  }

  get progressoDia(): number {
    if (this.cronograma.length === 0) return 0;
    return Math.round((this.concluidos / this.cronograma.length) * 100);
  }

  get cumprimentoSemanal(): number {
    if (this.cronograma.length === 0) return 0;
    const concluidosComPeso = this.concluidos + this.emAndamento * 0.5;
    return Math.min(100, Math.round((concluidosComPeso / this.cronograma.length) * 100));
  }

  get descansoMeta(): number {
    return 8;
  }

  formatarHorario(horario: string): string {
    if (!horario) return '--:--';
    const data = new Date(horario);
    if (isNaN(data.getTime())) return horario;
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  formatarIntervalo(horario: string): string {
    if (!horario) return '--:-- - --:--';
    const inicio = new Date(horario);
    if (isNaN(inicio.getTime())) return horario;
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);
    return `${this.formatarHorario(horario)} - ${this.formatarHorario(fim.toISOString())}`;
  }

  getIconeTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      Despertar: '🌅',
      Alimentação: '🍽️',
      Exercício: '🏃',
      Trabalho: '🔧',
      Manutencao: '🔧',
      Manutenção: '🔧',
      Saude: '💓',
      Saúde: '💓',
      Navegacao: '🛰️',
      Navegação: '🛰️',
      Comunicacao: '📡',
      Comunicação: '📡',
      Mecânica: '⚙️',
      Mecanica: '⚙️',
    };
    return mapa[tipo] ?? '📋';
  }

  getPrioridadeClass(prioridade: string): string {
    const valor = String(prioridade || '').toUpperCase();
    if (valor === 'ALTA' || valor === 'CRITICA') return 'prioridade-alta';
    if (valor === 'BAIXA') return 'prioridade-baixa';
    return 'prioridade-normal';
  }

  getStatusClass(status: string): string {
    const valor = String(status || '').toUpperCase();
    if (valor === 'CONCLUIDO') return 'status-concluido';
    if (valor === 'ANDAMENTO') return 'status-andamento';
    return 'status-pendente';
  }

  getStatusLabel(status: string): string {
    const valor = String(status || '').toUpperCase();
    if (valor === 'CONCLUIDO') return '✓ Concluído';
    if (valor === 'ANDAMENTO') return 'Em Andamento';
    return 'Pendente';
  }

  private atualizarRelogio() {
    const agora = new Date();
    const dia = String(agora.getUTCDate()).padStart(2, '0');
    const mes = String(agora.getUTCMonth() + 1).padStart(2, '0');
    const ano = agora.getUTCFullYear();
    this.dataAtual = `${dia}/${mes}/${ano}`;

    const horas = String(agora.getUTCHours()).padStart(2, '0');
    const minutos = String(agora.getUTCMinutes()).padStart(2, '0');
    this.horaUtc = `${horas}:${minutos} UTC`;
  }
}
