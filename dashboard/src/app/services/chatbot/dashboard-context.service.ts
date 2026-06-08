import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TransactionData {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  valor: number;
  dataTransacao: string;
  nCartao?: string;
  cvv?: string;
  tpCartao?: string;
  vencimento?: string;
  idCliente: number;
}

export interface DashboardStats {
  totalTransacoes: number;
  totalTransacoesFeitas: number;
}

export interface ClientData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  valorMedioCompra: number;
  cartoes: any[];
  transacoes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardContextService {
  private transactionsSubject = new BehaviorSubject<TransactionData[]>([]);
  private statsSubject = new BehaviorSubject<DashboardStats>({
    totalTransacoes: 0,
    totalTransacoesFeitas: 0
  });
  private clientsSubject = new BehaviorSubject<ClientData[]>([]);

  public transactions$ = this.transactionsSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public clients$ = this.clientsSubject.asObservable();

  constructor() {}

  // Atualizar transações
  updateTransactions(transactions: TransactionData[]): void {
    this.transactionsSubject.next(transactions);
  }

  // Atualizar estatísticas
  updateStats(stats: DashboardStats): void {
    this.statsSubject.next(stats);
  }

  // Atualizar clientes
  updateClients(clients: ClientData[]): void {
    this.clientsSubject.next(clients);
  }

  // Obter dados atuais
  getTransactions(): TransactionData[] {
    return this.transactionsSubject.value;
  }

  getStats(): DashboardStats {
    return this.statsSubject.value;
  }

  getClients(): ClientData[] {
    return this.clientsSubject.value;
  }

  // Buscar cliente por nome
  findClientByName(name: string): ClientData | undefined {
    const clients = this.getClients();
    return clients.find(c => 
      c.nome.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Buscar transações por cliente
  getTransactionsByClient(clientId: number): TransactionData[] {
    return this.getTransactions().filter(t => t.idCliente === clientId);
  }

  // Buscar transações por valor
  getTransactionsByValueRange(min: number, max: number): TransactionData[] {
    return this.getTransactions().filter(t => t.valor >= min && t.valor <= max);
  }

  // Buscar transações por data
  getTransactionsByDate(startDate: Date, endDate: Date): TransactionData[] {
    return this.getTransactions().filter(t => {
      const [day, month, year] = t.dataTransacao.split('/');
      const transDate = new Date(`${year}-${month}-${day}`);
      return transDate >= startDate && transDate <= endDate;
    });
  }

  // Estatísticas por cliente
  getClientStats(clientId: number): any {
    const transactions = this.getTransactionsByClient(clientId);
    const total = transactions.reduce((sum, t) => sum + t.valor, 0);
    const avg = transactions.length > 0 ? total / transactions.length : 0;
    const max = transactions.length > 0 ? Math.max(...transactions.map(t => t.valor)) : 0;
    const min = transactions.length > 0 ? Math.min(...transactions.map(t => t.valor)) : 0;

    return {
      totalTransactions: transactions.length,
      totalAmount: total,
      averageAmount: avg,
      maxTransaction: max,
      minTransaction: min,
      transactions
    };
  }

  // Gerar contexto formatado para a Luma
  getFormattedContext(): string {
    const stats = this.getStats();
    const transactions = this.getTransactions();
    const clients = this.getClients();

    return `
CONTEXTO DO DASHBOARD:

📊 ESTATÍSTICAS GERAIS:
- Valor total de transações: R$ ${stats.totalTransacoes.toFixed(2)}
- Total de transações: ${stats.totalTransacoesFeitas}

👥 CLIENTES CADASTRADOS: ${clients.length}
${clients.slice(0, 5).map(c => `- ${c.nome} (${c.email}): ${c.transacoes.length} transações`).join('\n')}

💳 ÚLTIMAS 10 TRANSAÇÕES:
${transactions.slice(0, 10).map((t, i) => 
  `${i + 1}. ${t.nome} - R$ ${t.valor.toFixed(2)} em ${t.dataTransacao}`
).join('\n')}
    `.trim();
  }
}
