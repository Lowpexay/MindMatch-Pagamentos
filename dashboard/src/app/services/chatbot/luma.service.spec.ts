import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LumaService } from './luma.service';

describe('LumaService', () => {
  let service: LumaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LumaService]
    });
    service = TestBed.inject(LumaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with welcome message', (done) => {
    service.chatHistory$.subscribe(history => {
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].role).toBe('assistant');
      done();
    });
  });

  it('should add user message to history', () => {
    const initialHistoryLength = service.getChatHistory().length;
    service.sendMessage('Hello').subscribe();
    expect(service.getChatHistory().length).toBeGreaterThan(initialHistoryLength);
  });

  it('should clear chat history', () => {
    service.clearHistory();
    const history = service.getChatHistory();
    expect(history.length).toBe(1); // Only welcome message
    expect(history[0].role).toBe('assistant');
  });
});
