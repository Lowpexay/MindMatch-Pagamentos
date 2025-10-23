# ❓ FAQ - Perguntas Frequentes

## Sobre o Chatbot Luma

### 1. O que é a Luma?
A Luma é uma assistente virtual inteligente integrada ao Smart HAS, desenvolvida usando o Google Gemini Pro. Ela ajuda usuários a entender seus dados financeiros, gerar relatórios e receber sugestões personalizadas.

### 2. Onde encontro o chatbot no dashboard?
Após fazer login, procure por um botão flutuante roxo no canto inferior direito da tela. Clique nele para abrir o chat com a Luma.

### 3. A Luma está disponível 24/7?
Sim! A Luma está sempre disponível para responder suas perguntas, desde que você tenha acesso à internet.

### 4. Posso usar a Luma em português?
Sim! A Luma foi configurada para responder em português brasileiro de forma natural e amigável.

### 5. A Luma tem acesso aos meus dados pessoais?
A Luma tem acesso apenas aos dados que você compartilha durante a conversa e aos dados do seu perfil necessários para fornecer análises personalizadas. Informações sensíveis (senhas, CPF completo, etc.) são filtradas antes de serem processadas.

---

## Sobre o Pipeline CI/CD

### 6. O que é CI/CD?
CI/CD significa "Continuous Integration/Continuous Deployment" (Integração Contínua/Deploy Contínuo). É uma prática de automatizar testes e deploys do código.

### 7. Quando o pipeline é executado?
O pipeline é executado automaticamente quando:
- Você faz push para as branches `main` ou `develop`
- Abre um Pull Request para essas branches

### 8. Quanto tempo leva para executar?
Em média, o pipeline completo leva de 10 a 15 minutos, dependendo do tamanho das mudanças.

### 9. O que acontece se o pipeline falhar?
Se o pipeline falhar:
1. Você receberá uma notificação no GitHub
2. O merge será bloqueado (no caso de PR)
3. Você pode ver os logs detalhados na aba Actions
4. Corrija os erros e faça push novamente

### 10. Como visualizo os logs do pipeline?
1. Acesse a aba **Actions** no GitHub
2. Clique na execução desejada
3. Selecione o job específico
4. Expanda os steps para ver logs detalhados

---

## Sobre Configuração e Setup

### 11. Por que preciso de uma API Key do Google Gemini?
A API Key é necessária para autenticar e autorizar as requisições ao Google Gemini, que é o "cérebro" por trás da Luma.

### 12. A API do Gemini é gratuita?
Sim! O Google oferece um tier gratuito generoso:
- Primeiro 1 milhão de tokens por mês: Grátis
- Tokens adicionais: ~$0.00025 por 1K tokens

Para uso típico, você provavelmente ficará dentro do limite gratuito.

### 13. Onde coloco a API Key?
A API Key deve ser colocada em dois lugares:
1. **Local:** No arquivo `.env` do dashboard (não faça commit!)
2. **GitHub:** Como secret em Settings → Secrets and variables → Actions

### 14. Como sei se minha API Key está funcionando?
1. Execute o dashboard localmente: `npm run dev`
2. Abra o chatbot e envie uma mensagem
3. Se receber resposta, está funcionando!
4. Caso contrário, verifique o console do navegador (F12)

### 15. Preciso configurar todos os secrets?
**Obrigatórios:**
- `VITE_GEMINI_API_KEY`
- `ORACLE_DB_HOST`
- `ORACLE_DB_USER`
- `ORACLE_DB_PASSWORD`

**Opcionais (para deploy):**
- AWS secrets
- Vercel token
- SonarCloud token

---

## Sobre Segurança

### 16. Minha API Key está segura?
Sim, desde que você:
- ✅ Nunca faça commit do arquivo `.env`
- ✅ Use apenas secrets do GitHub para CI/CD
- ✅ Não exponha a key no código ou logs

### 17. O que acontece se eu commitar o .env por engano?
1. **Revogue imediatamente** a API Key no Google Cloud Console
2. **Remova o arquivo** do histórico do Git:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch dashboard/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Gere uma nova** API Key
4. **Force push:** `git push origin --force --all`

### 18. Como protejo dados sensíveis ao usar a Luma?
O serviço `LumaService` possui sanitização automática que remove campos sensíveis antes de enviar à API. Você pode customizar isso no método `sanitizeData()`.

---

## Sobre Uso e Funcionalidades

### 19. Que tipo de perguntas posso fazer à Luma?

**Exemplos:**
- "Analise meus gastos deste mês"
- "Quais são minhas principais categorias de despesa?"
- "Como posso economizar mais?"
- "Explique esta transação de R$ 150"
- "Compare meus gastos com o mês passado"
- "Faça uma previsão para o próximo mês"

### 20. A Luma pode fazer cálculos complexos?
Sim! A Luma pode analisar padrões, calcular médias, identificar tendências e fazer previsões baseadas nos seus dados históricos.

### 21. Posso limpar o histórico de conversa?
Sim! Clique no botão "Limpar conversa" no footer do chatbot. Isso reinicia a conversa (mas não apaga dados do seu sistema).

### 22. A Luma aprende com minhas conversas?
A cada conversa, a Luma mantém o contexto da sessão atual. Porém, ela não "aprende" permanentemente (não há fine-tuning ativo no momento).

### 23. Quantas mensagens posso enviar?
Não há limite de mensagens, mas lembre-se do limite de tokens da API (1M/mês grátis).

---

## Troubleshooting

### 24. O chatbot não aparece
**Possíveis causas:**
- Você está na página de login (não aparece lá)
- Erro de JavaScript (verifique console F12)
- Componente não importado corretamente

**Solução:**
1. Confirme que está logado
2. Limpe cache do navegador
3. Verifique console por erros

### 25. A Luma não responde
**Possíveis causas:**
- API Key incorreta ou expirada
- Limite de API excedido
- Problemas de rede

**Solução:**
1. Verifique API Key no `.env`
2. Teste diretamente no Google AI Studio
3. Veja console (F12) por erros de HTTP

### 26. Erro "Cannot find module"
**Causa:** Dependências não instaladas

**Solução:**
```bash
cd dashboard
rm -rf node_modules package-lock.json
npm install
```

### 27. Pipeline falha com "Secret not found"
**Causa:** Secret não configurado no GitHub

**Solução:**
1. Vá em Settings → Secrets and variables → Actions
2. Adicione o secret faltante
3. Re-execute o workflow

### 28. Build do Angular falha
**Possíveis causas:**
- Erro de TypeScript
- Dependência incompatível
- Arquivo .env faltando

**Solução:**
```bash
# Verifique erros
npm run build

# Se necessário, reinstale
npm ci
```

---

## Sobre Performance

### 29. A Luma é rápida?
O tempo de resposta varia:
- **Média:** 2-4 segundos
- **Consultas simples:** 1-2 segundos
- **Análises complexas:** 5-8 segundos

Depende da carga da API do Gemini e da complexidade da pergunta.

### 30. Posso melhorar a performance?
Sim! Algumas dicas:
- Cache respostas frequentes
- Use debounce em inputs
- Limite o tamanho do contexto enviado
- Implemente paginação para dados grandes

---

## Sobre Custos

### 31. Quanto custa usar o sistema?
**Google Gemini API:**
- Primeiro 1M tokens/mês: **Grátis**
- Tokens adicionais: ~$0.00025/1K tokens

**Estimativa para 1000 usuários ativos:**
- ~5M tokens/mês
- Custo: ~$1.00/mês

**Praticamente grátis!**

### 32. Como monitoro meu uso da API?
1. Acesse: https://console.cloud.google.com/apis/dashboard
2. Selecione seu projeto
3. Veja "Generative Language API"
4. Monitore quotas e uso

---

## Sobre Integrações Futuras

### 33. A Luma funcionará no WhatsApp?
Está no roadmap! A arquitetura já está preparada para isso. Veja `docs/IA_GENERATIVA_DOCUMENTACAO.md` para mais detalhes.

### 34. Posso integrar com outros LLMs (ChatGPT, Claude)?
Sim! O serviço está estruturado para facilitar a troca de providers. Você precisaria:
1. Criar um adapter para o novo LLM
2. Ajustar o formato de requisição/resposta
3. Atualizar variáveis de ambiente

### 35. Haverá comandos por voz?
Está planejado para Fase 3 do roadmap! Veja `IMPLEMENTACAO_RESUMO.md` para timeline.

---

## Desenvolvimento

### 36. Como adiciono novos casos de uso?
1. Adicione método em `luma-integration.service.ts`
2. Escreva testes
3. Documente em `LUMA_INTEGRATION_EXAMPLES.md`
4. Implemente no componente relevante

### 37. Como customizo as respostas da Luma?
Edite o `systemContext` em `luma.service.ts`:
```typescript
private systemContext = `
  Você é Luma, assistente do Smart HAS.
  [Suas instruções personalizadas aqui]
`;
```

### 38. Posso treinar um modelo próprio?
Para fine-tuning customizado, você precisaria:
1. Coletar dados de treino
2. Usar Google AI Studio ou Vertex AI
3. Atualizar endpoint na aplicação

Isso não está implementado no momento, mas é possível.

---

## Testes

### 39. Como testo o chatbot localmente?
```bash
cd dashboard
npm run dev
# Abra http://localhost:4200
# Faça login e teste o chatbot
```

### 40. Como executo testes automatizados?
```bash
# Backend
mvn test

# Dashboard
cd dashboard && npm run test

# Mobile
cd mobile && npm run test
```

---

## Contribuindo

### 41. Como posso contribuir?
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça suas alterações
4. Adicione testes
5. Abra um Pull Request

### 42. Há um guia de estilo de código?
Sim! Seguimos:
- **TypeScript:** Angular style guide
- **Java:** Google Java Style Guide
- **Commits:** Conventional Commits

---

## Suporte

### 43. Onde obtenho mais ajuda?
1. **Documentação:** Leia `docs/` completamente
2. **Issues:** Abra uma issue no GitHub
3. **Email:** Contate a equipe de desenvolvimento

### 44. Como reporto bugs?
Abra uma issue no GitHub com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs observado
- Logs e screenshots (se aplicável)

---

## Mais Informações

Para documentação completa, consulte:
- `IMPLEMENTACAO_RESUMO.md` - Visão geral
- `SETUP_GUIDE.md` - Guia de setup
- `docs/IA_GENERATIVA_DOCUMENTACAO.md` - Documentação técnica
- `docs/LUMA_INTEGRATION_EXAMPLES.md` - Exemplos de código
- `.github/SECRETS_SETUP.md` - Configuração de secrets
- `.github/workflows/PIPELINE_CONFIG.md` - CI/CD

---

**Última atualização:** Outubro 2025
**Não encontrou sua pergunta?** Abra uma issue no GitHub!
