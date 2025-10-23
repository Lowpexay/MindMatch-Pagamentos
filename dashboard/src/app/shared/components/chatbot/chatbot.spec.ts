import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatbotComponent } from './chatbot';
import { LumaService } from '../../services/chatbot/luma.service';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, HttpClientTestingModule],
      providers: [LumaService]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle chat window', () => {
    expect(component.isOpen).toBeFalsy();
    component.toggleChat();
    expect(component.isOpen).toBeTruthy();
    component.toggleChat();
    expect(component.isOpen).toBeFalsy();
  });

  it('should send message when input is not empty', () => {
    component.userInput = 'Test message';
    const initialLength = component.messages.length;
    component.sendMessage();
    expect(component.userInput).toBe('');
  });

  it('should not send empty message', () => {
    component.userInput = '   ';
    const initialLength = component.messages.length;
    component.sendMessage();
    expect(component.messages.length).toBe(initialLength);
  });
});
