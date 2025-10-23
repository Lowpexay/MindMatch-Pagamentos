# Exemplos de Uso - Chatbot Luma

## Como Integrar Luma com Seus Componentes

### 1. Importar o Serviço

```typescript
import { LumaIntegrationService } from '../../services/chatbot/luma-integration.service';

export class TransacoesComponent {
  constructor(private lumaIntegration: LumaIntegrationService) {}
}
```

### 2. Analisar Transações

```typescript
// No componente de transações
analyzeMyTransactions() {
  this.lumaIntegration.analyzeTransactions(this.transactions)
    .subscribe(analysis => {
      console.log('Análise:', analysis);
      // Exibir em modal ou notificação
      this.showAnalysisModal(analysis);
    });
}
```

### 3. Gerar Relatório Mensal

```typescript
// Gerar relatório do mês atual
generateReport() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  this.lumaIntegration.generateMonthlyReport(
    this.allTransactions,
    month,
    year
  ).subscribe(report => {
    this.displayReport(report);
  });
}
```

### 4. Obter Sugestões Personalizadas

```typescript
// No componente de perfil ou dashboard
getOptimizationTips() {
  const userData = {
    transactions: this.userTransactions,
    profile: this.userProfile,
    goals: this.financialGoals
  };

  this.lumaIntegration.getPersonalizedSuggestions(userData)
    .subscribe(suggestions => {
      this.showSuggestions(suggestions);
    });
}
```

### 5. Comparar Períodos

```typescript
// Comparar este mês com o anterior
compareWithLastMonth() {
  const thisMonth = this.filterCurrentMonth(this.transactions);
  const lastMonth = this.filterLastMonth(this.transactions);

  this.lumaIntegration.comparePeriodsAnalysis(thisMonth, lastMonth)
    .subscribe(comparison => {
      this.showComparison(comparison);
    });
}
```

### 6. Explicar Transação Específica

```typescript
// Ao clicar em uma transação
onTransactionClick(transaction: any) {
  this.lumaIntegration.explainTransaction(transaction)
    .subscribe(explanation => {
      this.showTransactionDetails(transaction, explanation);
    });
}
```

### 7. Previsão de Gastos

```typescript
// Dashboard inicial
showSpendingForecast() {
  const last3Months = this.getLast3MonthsData();

  this.lumaIntegration.predictFutureSpending(last3Months)
    .subscribe(prediction => {
      this.displayForecast(prediction);
    });
}
```

### 8. Alertas de Gastos Incomuns

```typescript
// Executar ao carregar dashboard
checkForAlerts() {
  const recentTransactions = this.getRecentTransactions(7); // últimos 7 dias
  const historicalAverage = this.calculateHistoricalAverage();

  this.lumaIntegration.checkUnusualSpending(
    recentTransactions,
    historicalAverage
  ).subscribe(alert => {
    if (alert.includes('alerta') || alert.includes('atenção')) {
      this.showAlert(alert);
    }
  });
}
```

---

## Exemplo Completo - Componente de Dashboard

```typescript
import { Component, OnInit } from '@angular/core';
import { LumaIntegrationService } from '../../services/chatbot/luma-integration.service';
import { TransacoesService } from '../../services/transacoes/transacoes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.less']
})
export class HomeComponent implements OnInit {
  transactions: any[] = [];
  aiInsights: string = '';
  showInsights: boolean = false;
  loading: boolean = false;

  constructor(
    private lumaIntegration: LumaIntegrationService,
    private transacoesService: TransacoesService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transacoesService.getAll().subscribe(data => {
      this.transactions = data;
      this.checkForAlerts();
    });
  }

  // Botão "Analisar com IA"
  analyzeWithAI() {
    this.loading = true;
    this.showInsights = true;

    this.lumaIntegration.analyzeTransactions(this.transactions)
      .subscribe({
        next: (insights) => {
          this.aiInsights = insights;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao analisar:', err);
          this.aiInsights = 'Erro ao gerar análise. Tente novamente.';
          this.loading = false;
        }
      });
  }

  // Verificação automática de alertas
  private checkForAlerts() {
    const recent = this.transactions.slice(0, 10);
    const average = this.calculateAverage(this.transactions);

    this.lumaIntegration.checkUnusualSpending(recent, average)
      .subscribe(alert => {
        // Mostrar notificação se houver algo importante
        if (this.shouldShowAlert(alert)) {
          this.showNotification(alert);
        }
      });
  }

  private calculateAverage(transactions: any[]) {
    // Sua lógica de cálculo de média
    return {};
  }

  private shouldShowAlert(alert: string): boolean {
    const keywords = ['alerta', 'atenção', 'elevado', 'incomum'];
    return keywords.some(word => alert.toLowerCase().includes(word));
  }

  private showNotification(message: string) {
    // Implementar notificação (toast, modal, etc)
    console.log('Alerta:', message);
  }
}
```

### Template HTML Correspondente

```html
<div class="dashboard-container">
  <h1>Meu Dashboard Financeiro</h1>

  <!-- Botão de análise com IA -->
  <button 
    class="ai-analyze-btn" 
    (click)="analyzeWithAI()"
    [disabled]="loading">
    <span *ngIf="!loading">🤖 Analisar com IA</span>
    <span *ngIf="loading">⏳ Analisando...</span>
  </button>

  <!-- Painel de insights -->
  <div class="ai-insights-panel" *ngIf="showInsights">
    <h3>💡 Insights da Luma</h3>
    <div class="insights-content" [innerHTML]="aiInsights | markdown"></div>
  </div>

  <!-- Lista de transações -->
  <div class="transactions-list">
    <div 
      *ngFor="let transaction of transactions" 
      class="transaction-item"
      (click)="explainTransaction(transaction)">
      <!-- Conteúdo da transação -->
    </div>
  </div>
</div>
```

---

## Boas Práticas

### 1. Loading States
Sempre mostre feedback visual durante processamento:
```typescript
this.loading = true;
// ... chamada ao serviço
this.loading = false;
```

### 2. Error Handling
Trate erros graciosamente:
```typescript
.subscribe({
  next: (data) => { /* sucesso */ },
  error: (err) => {
    console.error(err);
    this.showErrorMessage('Erro ao processar. Tente novamente.');
  }
});
```

### 3. Debounce para Múltiplas Chamadas
Evite chamadas excessivas à API:
```typescript
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

searchSubject.pipe(
  debounceTime(500),
  distinctUntilChanged()
).subscribe(query => {
  this.lumaService.sendMessage(query);
});
```

### 4. Cache de Respostas
Implemente cache para perguntas frequentes:
```typescript
private cache = new Map<string, string>();

getResponse(query: string): Observable<string> {
  if (this.cache.has(query)) {
    return of(this.cache.get(query)!);
  }
  
  return this.lumaService.sendMessage(query).pipe(
    tap(response => this.cache.set(query, response))
  );
}
```

### 5. Contextualização Inteligente
Sempre forneça contexto relevante:
```typescript
// ❌ Ruim
this.lumaService.sendMessage('Analise isto');

// ✅ Bom
this.lumaService.sendMessage('Analise isto', {
  userId: this.userId,
  period: 'last_30_days',
  data: this.relevantData
});
```

---

## Casos de Uso por Página

### Home/Dashboard
- ✅ Resumo automático ao carregar
- ✅ Alertas de gastos incomuns
- ✅ Previsão para próximo mês

### Transações
- ✅ Análise detalhada de transações
- ✅ Explicação de transação individual
- ✅ Sugestões de categorização

### Perfil Pessoal
- ✅ Análise de hábitos financeiros
- ✅ Comparação de períodos
- ✅ Sugestões personalizadas de economia

---

## Testes

### Testar Integração

```typescript
describe('LumaIntegrationService', () => {
  it('should analyze transactions correctly', (done) => {
    const mockTransactions = [
      { valor: 100, categoria: 'Alimentação', data: new Date() }
    ];

    service.analyzeTransactions(mockTransactions).subscribe(result => {
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      done();
    });
  });
});
```

---

## Próximos Passos

1. Implementar nos componentes principais
2. Adicionar testes unitários
3. Coletar feedback dos usuários
4. Ajustar prompts baseado no feedback
5. Expandir funcionalidades

---

**Dúvidas?** Consulte a documentação completa em `docs/IA_GENERATIVA_DOCUMENTACAO.md`
