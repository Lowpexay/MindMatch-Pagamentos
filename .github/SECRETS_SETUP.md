# 🔐 Configuração de Secrets no GitHub

## Passo a Passo para Configurar os Secrets

### 1. Acesse as Configurações do Repositório

1. Vá até o repositório no GitHub: https://github.com/marcelo-neuro/entrega-6
2. Clique em **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Secrets and variables**
4. Selecione **Actions**

### 2. Adicione os Secrets Necessários

Clique no botão **New repository secret** para cada secret abaixo:

---

## 🔑 Secrets Obrigatórios

### Secret 1: VITE_GEMINI_API_KEY
```
Nome: VITE_GEMINI_API_KEY
Valor: AIzaSyAMWFTeiS62Qk5lKrYGB4y9qjPfSehEJc8
```

**Como obter:**
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

**Uso:** Autenticação com Google Gemini API para o chatbot Luma

---

## 🗄️ Secrets do Banco de Dados Oracle

### Secret 2: ORACLE_DB_HOST
```
Nome: ORACLE_DB_HOST
Valor: [SEU_HOST_ORACLE:PORTA/SID]
Exemplo: oracle.fiap.com.br:1521/ORCL
```

### Secret 3: ORACLE_DB_USER
```
Nome: ORACLE_DB_USER
Valor: [SEU_USUARIO_ORACLE]
Exemplo: rm123456
```

### Secret 4: ORACLE_DB_PASSWORD
```
Nome: ORACLE_DB_PASSWORD
Valor: [SUA_SENHA_ORACLE]
```

**Uso:** Conexão com banco de dados Oracle para migrations e testes

---

## ☁️ Secrets de Deploy (Opcionais)

### Secret 5: AWS_ACCESS_KEY_ID (Opcional)
```
Nome: AWS_ACCESS_KEY_ID
Valor: [SUA_AWS_ACCESS_KEY]
```

**Como obter:**
1. Acesse AWS Console
2. IAM → Users → Seu usuário → Security credentials
3. Create access key

### Secret 6: AWS_SECRET_ACCESS_KEY (Opcional)
```
Nome: AWS_SECRET_ACCESS_KEY
Valor: [SUA_AWS_SECRET_KEY]
```

### Secret 7: AWS_REGION (Opcional)
```
Nome: AWS_REGION
Valor: us-east-1
```

**Uso:** Deploy automático do backend na AWS

---

### Secret 8: VERCEL_TOKEN (Opcional)
```
Nome: VERCEL_TOKEN
Valor: [SEU_TOKEN_VERCEL]
```

**Como obter:**
1. Acesse: https://vercel.com/account/tokens
2. Create Token
3. Copie o token gerado

**Uso:** Deploy automático do dashboard no Vercel

---

### Secret 9: SONAR_TOKEN (Opcional)
```
Nome: SONAR_TOKEN
Valor: [SEU_TOKEN_SONARCLOUD]
```

**Como obter:**
1. Acesse: https://sonarcloud.io/account/security
2. Generate Token
3. Copie o token

**Uso:** Análise de qualidade de código

---

## 📋 Checklist de Configuração

Marque conforme for adicionando:

### Obrigatórios
- [ ] `VITE_GEMINI_API_KEY` - **NECESSÁRIO**
- [ ] `ORACLE_DB_HOST` - **NECESSÁRIO** 
- [ ] `ORACLE_DB_USER` - **NECESSÁRIO**
- [ ] `ORACLE_DB_PASSWORD` - **NECESSÁRIO**

### Opcionais (para deploy)
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION`
- [ ] `VERCEL_TOKEN`
- [ ] `SONAR_TOKEN`

---

## ✅ Validar Configuração

### Teste 1: Verificar Secrets Configurados

1. Vá em Settings → Secrets and variables → Actions
2. Você deve ver os secrets listados (valores ocultos)
3. Confirme que todos os obrigatórios estão presentes

### Teste 2: Executar Pipeline

1. Faça um commit qualquer no branch `develop`:
   ```bash
   git checkout develop
   git commit --allow-empty -m "test: Validar CI/CD"
   git push origin develop
   ```

2. Vá na aba **Actions** do GitHub
3. Verifique se o workflow iniciou
4. Acompanhe os logs de cada job

### Teste 3: Verificar Logs

Se algum secret estiver incorreto, você verá erros como:
- `Invalid API key` → VITE_GEMINI_API_KEY incorreto
- `Connection refused` → ORACLE_DB_HOST incorreto
- `Authentication failed` → ORACLE_DB_USER/PASSWORD incorretos

---

## 🔒 Segurança

### Boas Práticas

✅ **NUNCA** commite secrets no código
✅ **SEMPRE** use o sistema de secrets do GitHub
✅ **REVOGUE** tokens comprometidos imediatamente
✅ **ROTACIONE** secrets periodicamente (a cada 90 dias)
✅ **USE** secrets diferentes para dev/staging/prod

### Se um Secret Vazar

1. **Revogue imediatamente** o token/key no serviço original
2. **Gere um novo** token/key
3. **Atualize** o secret no GitHub
4. **Investigue** onde/como vazou
5. **Implemente** medidas preventivas

---

## 🛠️ Troubleshooting

### Erro: "Secret not found"

**Causa:** Secret não configurado ou nome incorreto

**Solução:**
1. Verifique o nome exato (case-sensitive)
2. Confirme que está no repositório correto
3. Re-adicione o secret se necessário

### Erro: "Invalid API Key" (Gemini)

**Causa:** API key incorreta ou expirada

**Solução:**
1. Gere nova key em: https://makersuite.google.com/app/apikey
2. Atualize o secret `VITE_GEMINI_API_KEY`
3. Re-execute o workflow

### Erro: "Database connection failed"

**Causa:** Credenciais Oracle incorretas

**Solução:**
1. Teste conexão localmente com SQL Developer
2. Confirme host, usuário e senha
3. Atualize os secrets do Oracle
4. Verifique firewall/whitelist

### Erro: "Forbidden" ou "Unauthorized" (AWS/Vercel)

**Causa:** Credenciais de deploy incorretas

**Solução:**
1. Revogue e gere novas credenciais
2. Atualize os secrets correspondentes
3. Verifique permissões IAM (AWS) ou Project Settings (Vercel)

---

## 📞 Suporte

### Problemas com Secrets?

1. **Revise esta documentação** completamente
2. **Verifique os logs** na aba Actions
3. **Teste localmente** primeiro (quando possível)
4. **Abra uma issue** se o problema persistir

### Links Úteis

- **GitHub Secrets Docs:** https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Google Gemini API:** https://ai.google.dev/docs
- **AWS IAM:** https://aws.amazon.com/iam/
- **Vercel Tokens:** https://vercel.com/docs/rest-api#authentication

---

## 📝 Notas Importantes

1. **Secrets são criptografados** pelo GitHub e nunca expostos em logs
2. **Valores não podem ser lidos** depois de salvos (apenas substituídos)
3. **São herdados** por todos os workflows do repositório
4. **Não são compartilhados** entre forks (segurança)
5. **Têm limite de tamanho** (64 KB por secret)

---

## ✨ Conclusão

Após configurar todos os secrets obrigatórios:

✅ O pipeline CI/CD funcionará automaticamente
✅ O chatbot Luma terá acesso à API do Gemini
✅ O backend poderá conectar ao Oracle
✅ Os deploys automáticos funcionarão (se configurados)

**Lembre-se:** Mantenha seus secrets seguros e nunca os compartilhe publicamente!

---

**Última atualização:** Outubro 2025
**Versão:** 1.0
