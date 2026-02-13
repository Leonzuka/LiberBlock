# Deploy no Railway

## Pré-requisitos
- Conta no Railway (https://railway.app)
- Repositório Git conectado ou Railway CLI instalado

## Passos para Deploy

### Opção 1: Via GitHub (Recomendado)

1. **Faça push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Preparar para deploy no Railway"
   git push origin main
   ```

2. **No Railway Dashboard:**
   - Acesse https://railway.app/new
   - Clique em "Deploy from GitHub repo"
   - Selecione o repositório `LiberBlock`
   - O Railway detectará automaticamente que é um projeto Next.js

3. **Configurações Automáticas:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: 3000 (detectado automaticamente)

4. **Variáveis de Ambiente (se necessário):**
   - Acesse a aba "Variables" no seu projeto
   - Adicione as variáveis conforme `.env.example`

### Opção 2: Via Railway CLI

1. **Instale o Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login e deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Vincule domínio:**
   ```bash
   railway domain
   ```

## Verificação Pós-Deploy

Após o deploy, verifique:
- ✅ Build completado com sucesso
- ✅ Healthcheck passando (endpoint `/`)
- ✅ Assets 3D carregando corretamente
- ✅ Animações GSAP funcionando
- ✅ Formulário de contato operacional

## Domínio Customizado

Para adicionar um domínio customizado:
1. Acesse Settings → Domains no Railway
2. Clique em "Add Domain"
3. Configure os DNS records no seu provedor de domínio

## Monitoramento

- **Logs:** Acesse a aba "Logs" no Railway Dashboard
- **Metrics:** Verifique uso de CPU/RAM na aba "Metrics"
- **Deployments:** Histórico de deploys na aba "Deployments"

## Troubleshooting

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Confira os logs de build no Railway

### Healthcheck falha
- Certifique-se que a porta 3000 está sendo usada
- Verifique se o `railway.toml` está configurado corretamente

### Imagens não carregam
- Confirme que os assets estão no repositório
- Verifique paths relativos em `next.config.js`

## Configurações Avançadas

O arquivo `railway.toml` já está configurado com:
- Builder: Nixpacks (recomendado para Next.js)
- Healthcheck no endpoint `/`
- Restart policy com retry automático
- 1 réplica (pode aumentar para escalar)

## Links Úteis
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Discord](https://discord.gg/railway)
