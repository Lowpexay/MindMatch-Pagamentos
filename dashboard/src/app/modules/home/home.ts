import { Component, inject } from '@angular/core';
import { CardComponent } from './components/card/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../services/home/home';
import { AppModule } from '../../app';
import { Router } from '@angular/router';
import { DashboardContextService } from '../../services/chatbot/dashboard-context.service';

@Component({
  selector: 'dash-home',
  imports: [CardComponent, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class HomeComponet {
  private dashboardContext = inject(DashboardContextService);
  
  constructor(private homeService: HomeService, public global: AppModule, private router: Router) {}

  ngOnInit() {
    if (this.global.logou == true) {
      this.obterMissoes();
      this.obterDados();
    } else {
      this.router.navigate(['']);
    }
  }

  pessoal: any[] = [];
  cartoes: any = [];
  listaDados: any[] = [];
  nomes: any = []
  listaAgentes: any = []

  totalAgentes: number = 0;
  totalMissoes: number = 0;
  agentesAtencao: number = 0;
  agentesCriticos: number = 0;
  agentesNormal: number = 0;
  statusCritico: number = 0;

  get agentesEmRisco(): number {
    return this.agentesAtencao + this.agentesCriticos;
  }

  temAgente: boolean = false;
  modalCriarAgente: boolean = false;
  erroModal: string = '';
  missoes: any[] = [];

  novoAgente = {
    nome: '',
    especialidade: '',
    ultimaRevisao: '',
    descanso: null as number | null,
    idMissao: null as number | null,
  };

  obterDados() {
    this.homeService.obterAgentes().subscribe({
      next: (dados: any[]) => {
        this.temAgente = Array.isArray(dados) && dados.length > 0;
        this.totalAgentes = dados.length;
        this.agentesAtencao = dados.filter((item: any) => item.status === 'ATENCAO').length;
        this.agentesCriticos = dados.filter((item: any) => item.status === 'CRITICO').length;
        this.agentesNormal = dados.filter((item: any) => item.status === 'NORMAL').length;

        this.listaAgentes = (dados || []).map((item: any) => ({
          ...item,
          nomeMissao: this.getNomeMissao(item.idMissao),
        }));

        if (!this.temAgente) {
          this.modalCriarAgente = true;
        }
        this.updateDashboardContext(); // Atualizar contexto para a Luma
      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
        this.modalCriarAgente = true;
      },
    });
  }

  private getNomeMissao(idMissao: number): string {
    const missao = this.missoes.find((m) => m.id === idMissao);
    return missao ? missao.nome : `Missão ${idMissao}`;
  }

  obterMissoes() {
    this.homeService.obterMissoes().subscribe({
      next: (dados: any[]) => {
        this.missoes = dados || [];
        this.totalMissoes = dados.length
      },
      error: (erro) => {
        console.error('Erro ao buscar missões:', erro);
      },
    });
  }

  openModal() {
    this.modalCriarAgente = true;
    this.erroModal = '';
  }

  closeModal() {
    this.modalCriarAgente = false;
    this.erroModal = '';
  }

  resetForm() {
    this.novoAgente = {
      nome: '',
      especialidade: '',
      ultimaRevisao: '',
      descanso: null,
      idMissao: null,
    };
  }

  salvarAgente() {
    if (
      !this.novoAgente.nome ||
      !this.novoAgente.especialidade ||
      !this.novoAgente.ultimaRevisao ||
      this.novoAgente.descanso === null ||
      this.novoAgente.idMissao === null
    ) {
      this.erroModal = 'Preencha todos os campos para cadastrar o agente.';
      return;
    }

    this.homeService.criarAgente(this.novoAgente).subscribe({
      next: () => {
        this.closeModal();
        this.temAgente = true;
        this.resetForm();
        this.obterDados();
      },
      error: (erro) => {
        console.error('Erro ao criar agente:', erro);
        this.erroModal = 'Não foi possível cadastrar o agente. Tente novamente.';
      },
    });
  }

  public selecionarUsuario(id:number, telefone: string, email: string, idPagamento: number) {
        this.router.navigate(['/pessoal']);
  }

  public formatarData(dataISO: string): string {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  public formatDateToBR(isoDate: string): string {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // mês começa em 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

  // Atualizar contexto do dashboard para a Luma
  private updateDashboardContext(): void {
    // Atualizar estatísticas
    this.dashboardContext.updateStats({
      totalTransacoes: this.totalAgentes,
      totalTransacoesFeitas: this.totalMissoes
    });

    // Atualizar transações
    this.dashboardContext.updateTransactions(this.listaAgentes);

    // Atualizar clientes
    this.dashboardContext.updateClients(this.listaDados);
  }
}

