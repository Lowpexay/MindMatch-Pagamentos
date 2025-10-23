import { Injectable } from '@angular/core';
import { LumaService } from '../chatbot/luma.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Serviço de integração entre Luma e os dados do Dashboard
 * Fornece contexto específico do usuário para respostas mais precisas
 */
@Injectable({
  providedIn: 'root'
})
export class LumaIntegrationService {

  constructor(private lumaService: LumaService) {}

  /**
   * Analisa transações do usuário e gera insights
   */
  public analyzeTransactions(transactions: any[]): Observable<string> {
    const context = {
      totalTransactions: transactions.length,
      transactions: transactions.slice(0, 10), // Últimas 10 transações
      totalAmount: this.calculateTotal(transactions),
      categories: this.groupByCategory(transactions),
      period: this.getPeriod(transactions)
    };

    const message = `
      Analise minhas transações recentes e forneça insights úteis.
      Identifique padrões, categorias principais e sugestões de economia.
    `;

    return this.lumaService.sendMessage(message, context).pipe(
      map((chatMessage: any) => chatMessage.content || String(chatMessage))
    );
  }

  /**
   * Gera relatório mensal personalizado
   */
  public generateMonthlyReport(
    transactions: any[], 
    month: number, 
    year: number
  ): Observable<string> {
    const context = {
      month: this.getMonthName(month),
      year: year,
      transactions: this.filterByMonth(transactions, month, year),
      summary: this.generateSummary(transactions, month, year)
    };

    return this.lumaService.generateReport(context);
  }

  /**
   * Solicita sugestões de otimização baseadas no perfil do usuário
   */
  public getPersonalizedSuggestions(userData: {
    transactions: any[];
    profile: any;
    goals?: any;
  }): Observable<string> {
    const context = {
      recentTransactions: userData.transactions.slice(0, 20),
      spendingPattern: this.analyzeSpendingPattern(userData.transactions),
      userProfile: userData.profile,
      financialGoals: userData.goals
    };

    return this.lumaService.getOptimizationSuggestions(context);
  }

  /**
   * Compara gastos entre períodos
   */
  public comparePeriodsAnalysis(
    currentPeriod: any[],
    previousPeriod: any[]
  ): Observable<string> {
    const context = {
      current: {
        total: this.calculateTotal(currentPeriod),
        categories: this.groupByCategory(currentPeriod),
        count: currentPeriod.length
      },
      previous: {
        total: this.calculateTotal(previousPeriod),
        categories: this.groupByCategory(previousPeriod),
        count: previousPeriod.length
      },
      changes: this.calculateChanges(currentPeriod, previousPeriod)
    };

    const message = `
      Compare meus gastos entre os dois períodos e explique as principais diferenças.
      Destaque aumentos ou diminuições significativas.
    `;

    return this.lumaService.sendMessage(message, context).pipe(
      map((chatMessage: any) => chatMessage.content || String(chatMessage))
    );
  }

  /**
   * Explica uma transação específica
   */
  public explainTransaction(transaction: any): Observable<string> {
    const message = `
      Explique detalhadamente esta transação:
      - Valor: R$ ${transaction.valor}
      - Categoria: ${transaction.categoria}
      - Data: ${transaction.data}
      - Descrição: ${transaction.descricao}
      - Status: ${transaction.status}
      
      Forneça insights sobre o que isso significa e se há algo que eu deva saber.
    `;

    return this.lumaService.sendMessage(message, { transaction }).pipe(
      map((chatMessage: any) => chatMessage.content || String(chatMessage))
    );
  }

  /**
   * Previsão de gastos futuros
   */
  public predictFutureSpending(historicalData: any[]): Observable<string> {
    const context = {
      historical: historicalData,
      patterns: this.identifyPatterns(historicalData),
      averages: this.calculateAverages(historicalData)
    };

    const message = `
      Com base no meu histórico de gastos, faça uma previsão para o próximo mês.
      Indique áreas onde provavelmente gastarei mais e dê alertas preventivos.
    `;

    return this.lumaService.sendMessage(message, context).pipe(
      map((chatMessage: any) => chatMessage.content || String(chatMessage))
    );
  }

  /**
   * Alertas de gastos incomuns
   */
  public checkUnusualSpending(
    recentTransactions: any[],
    historicalAverage: any
  ): Observable<string> {
    const unusual = this.detectUnusualTransactions(
      recentTransactions, 
      historicalAverage
    );

    if (unusual.length === 0) {
      const message = 'Meus gastos estão normais ou há algo que eu deva saber?';
      return this.lumaService.sendMessage(message, {
        recentTransactions,
        historicalAverage
      }).pipe(
        map((chatMessage: any) => chatMessage.content || String(chatMessage))
      );
    }

    const message = `
      Identifiquei algumas transações que parecem fora do padrão.
      Analise e explique se devo me preocupar.
    `;

    return this.lumaService.sendMessage(message, {
      unusualTransactions: unusual,
      normalPattern: historicalAverage
    }).pipe(
      map((chatMessage: any) => chatMessage.content || String(chatMessage))
    );
  }

  // ========== Métodos Auxiliares ==========

  private calculateTotal(transactions: any[]): number {
    return transactions.reduce((sum, t) => sum + (t.valor || 0), 0);
  }

  private groupByCategory(transactions: any[]): any {
    const grouped: any = {};
    transactions.forEach(t => {
      const category = t.categoria || 'Outros';
      if (!grouped[category]) {
        grouped[category] = { count: 0, total: 0 };
      }
      grouped[category].count++;
      grouped[category].total += t.valor || 0;
    });
    return grouped;
  }

  private getPeriod(transactions: any[]): any {
    if (transactions.length === 0) return null;
    
    const dates = transactions.map(t => new Date(t.data));
    return {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime())))
    };
  }

  private filterByMonth(transactions: any[], month: number, year: number): any[] {
    return transactions.filter(t => {
      const date = new Date(t.data);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }

  private generateSummary(transactions: any[], month: number, year: number): any {
    const filtered = this.filterByMonth(transactions, month, year);
    return {
      total: this.calculateTotal(filtered),
      count: filtered.length,
      categories: this.groupByCategory(filtered),
      average: filtered.length > 0 ? this.calculateTotal(filtered) / filtered.length : 0
    };
  }

  private analyzeSpendingPattern(transactions: any[]): any {
    // Agrupa por dia da semana
    const byDayOfWeek: any = {};
    transactions.forEach(t => {
      const day = new Date(t.data).getDay();
      byDayOfWeek[day] = (byDayOfWeek[day] || 0) + (t.valor || 0);
    });

    // Agrupa por hora (se disponível)
    const byHour: any = {};
    transactions.forEach(t => {
      const hour = new Date(t.data).getHours();
      byHour[hour] = (byHour[hour] || 0) + 1;
    });

    return { byDayOfWeek, byHour };
  }

  private calculateChanges(current: any[], previous: any[]): any {
    const currentTotal = this.calculateTotal(current);
    const previousTotal = this.calculateTotal(previous);
    
    const percentChange = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;

    return {
      absolute: currentTotal - previousTotal,
      percent: percentChange,
      direction: percentChange > 0 ? 'increase' : 'decrease'
    };
  }

  private identifyPatterns(data: any[]): any {
    // Identifica padrões recorrentes
    const recurring: any = {};
    data.forEach(t => {
      const key = `${t.descricao}_${t.valor}`;
      recurring[key] = (recurring[key] || 0) + 1;
    });

    return {
      recurringTransactions: Object.entries(recurring)
        .filter(([_, count]) => (count as number) > 2)
        .map(([key, count]) => ({ pattern: key, occurrences: count }))
    };
  }

  private calculateAverages(data: any[]): any {
    const byCategory = this.groupByCategory(data);
    const averages: any = {};

    Object.keys(byCategory).forEach(category => {
      averages[category] = byCategory[category].total / byCategory[category].count;
    });

    return averages;
  }

  private detectUnusualTransactions(
    recent: any[], 
    average: any
  ): any[] {
    const threshold = 1.5; // 50% acima da média
    
    return recent.filter(t => {
      const categoryAvg = average[t.categoria] || 0;
      return t.valor > (categoryAvg * threshold);
    });
  }

  private getMonthName(month: number): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month] || 'Mês desconhecido';
  }
}
