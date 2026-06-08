import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppModule } from '../../app';
import { SinaisVitaisService } from '../../services/sinaisVitais/sinais-vitais';
import { MediaAgentesResponse, MediaSinal } from './models/sinais-vitais.interface';

@Component({
  selector: 'app-sinais-vitais',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sinais-vitais.html',
  styleUrls: ['./sinais-vitais.less'],
})
export class SinaisVitaisComponent implements OnInit {
  dados: MediaAgentesResponse | null = null;
  mensagem: string = '';
  carregando: boolean = false;

  constructor(
    private sinaisVitaisService: SinaisVitaisService,
    public global: AppModule,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.global.logou !== true) {
      this.router.navigate(['']);
      return;
    }

    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;
    this.mensagem = '';

    this.sinaisVitaisService.buscarMediaSinais().subscribe({
      next: (response) => {
        this.dados = response;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar médias de sinais:', erro);
        this.mensagem = 'Não foi possível carregar os dados de saúde. Tente novamente.';
        this.dados = null;
        this.carregando = false;
      },
    });
  }

  get sinais(): MediaSinal[] {
    return this.dados?.valorNedias ?? [];
  }

  get saudeFisicaMedia(): number {
    const fisicos = this.sinais.filter((s) => !this.isMental(s.nomeSinal));
    return this.calcularMedia(fisicos);
  }

  get saudeMentalMedia(): number {
    const mentais = this.sinais.filter((s) => this.isMental(s.nomeSinal));
    return this.calcularMedia(mentais);
  }

  formatarData(dataISO: string | null | undefined): string {
    if (!dataISO) return '--/--/----';
    const partes = dataISO.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return dataISO;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  getNomeExibicao(nomeSinal: string): string {
    const nome = nomeSinal.toLowerCase();
    if (nome.includes('cardiaca') || nome.includes('cardiovascular')) return 'Cardiovascular';
    if (nome.includes('respirat') || nome.includes('oxigen') || nome.includes('saturacao') || nome.includes('o2')) {
      return 'Respiratório';
    }
    if (nome.includes('stress') || nome.includes('psicol') || nome.includes('mental') || nome.includes('fadiga')) {
      return 'Psicológico';
    }
    if (nome.includes('sono')) return 'Qualidade do Sono';
    if (nome.includes('pressao')) return 'Pressão Arterial';
    return nomeSinal;
  }

  getIcone(nomeSinal: string): string {
    const nome = nomeSinal.toLowerCase();
    if (nome.includes('cardiaca') || nome.includes('cardiovascular')) return '❤️';
    if (nome.includes('respirat') || nome.includes('oxigen') || nome.includes('saturacao') || nome.includes('o2')) {
      return '🫁';
    }
    if (nome.includes('stress') || nome.includes('psicol') || nome.includes('mental') || nome.includes('fadiga')) {
      return '🧠';
    }
    if (nome.includes('sono')) return '😴';
    if (nome.includes('pressao')) return '🩸';
    return '💓';
  }

  formatarValorMedio(sinal: MediaSinal): string {
    const nome = sinal.nomeSinal.toLowerCase();
    const valor = Number(sinal.valorMedio);

    if (nome.includes('cardiaca') || nome.includes('cardiovascular')) {
      return `${valor} bpm`;
    }
    if (nome.includes('respirat') || nome.includes('irpm')) {
      return `${valor} irpm`;
    }
    if (nome.includes('sono')) {
      return `${valor}h`;
    }
    if (nome.includes('pressao')) {
      return `${valor} mmHg`;
    }
    return `${valor}%`;
  }

  formatarMediaCategoria(sinal: MediaSinal): string {
    return `Média: ${this.formatarValorMedio(sinal)}`;
  }

  getTendenciaClass(tendencia: string): string {
    const valor = String(tendencia || '').toUpperCase();
    if (valor === 'MELHORANDO') return 'tendencia-melhorando';
    if (valor === 'ATENCAO') return 'tendencia-atencao';
    if (valor === 'CRITICO') return 'tendencia-critico';
    return 'tendencia-estavel';
  }

  getTendenciaLabel(tendencia: string): string {
    const valor = String(tendencia || '').toUpperCase();
    if (valor === 'MELHORANDO') return 'Melhorando';
    if (valor === 'ATENCAO') return 'Atenção';
    if (valor === 'CRITICO') return 'Crítico';
    return 'Estável';
  }

  private isMental(nomeSinal: string): boolean {
    const nome = nomeSinal.toLowerCase();
    return (
      nome.includes('stress') ||
      nome.includes('mental') ||
      nome.includes('psicol') ||
      nome.includes('fadiga') ||
      nome.includes('sono')
    );
  }

  private calcularMedia(sinais: MediaSinal[]): number {
    if (sinais.length === 0) return 0;
    const soma = sinais.reduce((acc, s) => acc + Number(s.valorMedio), 0);
    return Math.min(100, Math.round((soma / sinais.length) * 10) / 10);
  }
}
