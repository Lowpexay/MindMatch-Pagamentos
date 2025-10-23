import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LumaService, ChatMessage } from '../../../services/chatbot/luma.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.less']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  isOpen = false;
  isMinimized = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  
  private chatSubscription?: Subscription;
  private shouldScrollToBottom = false;
  private lumaService = inject(LumaService);

  constructor() {}

  ngOnInit(): void {
    this.chatSubscription = this.lumaService.chatHistory$.subscribe(
      (messages: ChatMessage[]) => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      }
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
      this.shouldScrollToBottom = true;
    }
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const message = this.userInput.trim();
    this.userInput = '';
    this.isLoading = true;

    this.lumaService.sendMessage(message).subscribe({
      next: () => {
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
      error: (error: any) => {
        console.error('Erro ao enviar mensagem:', error);
        this.isLoading = false;
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.lumaService.clearHistory();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Erro ao rolar chat:', err);
    }
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
