import { Component, inject } from '@angular/core';
import { CardComponent } from './components/card/card';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home/home';
import { Pessoal } from '../pessoal/models/pessoal.interface';
import { AppModule } from '../../app';
import { Router } from '@angular/router';
import { DashboardContextService } from '../../services/chatbot/dashboard-context.service';

@Component({
  selector: 'dash-home',
  imports: [CardComponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class HomeComponet {
  private dashboardContext = inject(DashboardContextService);
  
  constructor(private homeService: HomeService, public global: AppModule, private router: Router) {}

  ngOnInit() {
    if (this.global.logou == true) {
      this.obterDados();
      this.obterCartoes();
      this.obterNomes();
    } else {
      this.router.navigate(['']);
    }
  }

  pessoal: any[] = [];
  cartoes: any = [];
  listaDados: any[] = [];
  nomes: any = []
  listaTransRecentes: any = []

  transRecente: number = 0;
  maiorTransacao: number = 0;
  totalTransacoes: number = 0;
  totalTransacoesFeitas: number = 0;

  async obterDados() {
    await this.homeService.obterDados().subscribe({
      next: (dados) => {
        this.pessoal = dados;

        this.totalTransacoesFeitas = this.pessoal.length;
        this.maiorTransacao = this.pessoal[1].valor;

        const maisRecente = this.pessoal.reduce((maisNova, atual) =>
          new Date(atual.dataTransacao) > new Date(maisNova.dataTransacao) ? atual : maisNova
        );

        this.transRecente = maisRecente.valor;
        // (this.pessoal);

        for (let i = 0; i < this.pessoal.length; i++) {
          // (this.pessoal[i]);
          this.totalTransacoes += this.pessoal[i].valor;

          if (this.maiorTransacao < this.pessoal[i].valor) {
            this.maiorTransacao = this.pessoal[i].valor;
          }

          // this.pessoal[i].transactionDate = formatarData(this.pessoal[i].transactionDate);
        }
        this.juntarDados();
        this.listarTransRecentes();
        this.updateDashboardContext(); // Atualizar contexto para a Luma
      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      },
    });
  }

  async obterCartoes() {
    await this.homeService.obterDadosCartao().subscribe({
      next: (dados) => {
        this.cartoes = dados;
      },
    });
  }
  async obterNomes() {
    await this.homeService.obterDadosNomes().subscribe({
      next: (dados) => {
        this.nomes = dados;
      },
    });
  }

  async juntarDados() {
    // (this.nomes);
    // (this.cartoes);
    (this.pessoal);

    for (let i = 0; i < this.nomes.length; i++) {

      let listaCompras = []
      for(let j=0; j<this.pessoal.length; j++){
        if(this.pessoal[j].clienteId === this.nomes[i].id){
          listaCompras.push(this.pessoal[j])
        }
      }

      let listaCartoes = []
      for(let l = 0; l<this.cartoes.length; l++){
        if(this.cartoes[l].clienteId === this.nomes[i].id){
          listaCartoes.push(this.cartoes[l])
        }
      }

      this.listaDados.push({
        id: this.nomes[i].id,
        nome: this.nomes[i].nome,
        email: this.nomes[i].email,
        telefone: this.nomes[i].telefone,
        valorMedioCompra: this.nomes[i].valorMedioCompra,
        cartoes: listaCartoes,
        transacoes: listaCompras
      });
    }
    // (this.listaDados);
    this.global.listaDados = this.listaDados
  }

  public selecionarUsuario(id:number, telefone: string, email: string, idPagamento: number) {
    this.global.telefone = telefone;
    this.global.email = email
    this.global.idCliente = id;
    this.global.idTransacao = idPagamento;
    this.global.selecionou = true;

    this.router.navigate(['/pessoal']);
  }

  async listarTransRecentes(){
    
    for(let i=0; i<this.pessoal.length; i++){
      // (this.pessoal[i]);

      let objNome = {}
      let objCartao = {}
      let transacao = {}

      transacao = {
        id: this.pessoal[i].id,
        valor: this.pessoal[i].valor,
        dataTransacao: this.formatDateToBR(this.pessoal[i].dataTransacao),
      }


      for(let l=0; l<this.nomes.length; l++){
        if(this.pessoal[i].clienteId === this.nomes[l].id){
          objNome = {
            nome: this.nomes[l].nome,
            telefone: this.nomes[l].telefone,
            email: this.nomes[l].email,
            idCliente: this.nomes[l].id
          }
        }
      }

      for(let j=0; j<this.cartoes.length; j++){
        if(this.pessoal[i].cartaoId === this.cartoes[j].id){
          objCartao = {
            nCartao: this.cartoes[j].numero,
            cvv: this.cartoes[j].cvv,
            tpCartao: this.cartoes[j].tipoCartao,
            vencimento: this.formatarData(this.cartoes[j].vencimento)
          }
        }
      }

      Object.assign(transacao, objNome);
      Object.assign(transacao, objCartao);
      

      this.listaTransRecentes.push(transacao)
    }
    console.log(this.listaTransRecentes);
    
  }

  public formatarParaReal(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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
      transRecente: this.transRecente,
      maiorTransacao: this.maiorTransacao,
      totalTransacoes: this.totalTransacoes,
      totalTransacoesFeitas: this.totalTransacoesFeitas
    });

    // Atualizar transações
    this.dashboardContext.updateTransactions(this.listaTransRecentes);

    // Atualizar clientes
    this.dashboardContext.updateClients(this.listaDados);
  }
}

