# 💰 ERP Financeiro Pessoal

Sistema completo de gestão financeira pessoal com foco em controle mensal, clareza de decisões e estabilidade funcional.

## 📋 Características Principais

- ✅ **100% Offline** - Funciona sem internet, dados salvos no navegador
- ✅ **Controle Mensal** - Organize suas finanças mês a mês
- ✅ **3 Tipos de Lançamentos** - Receitas, Despesas e Poupança
- ✅ **Dashboard Intuitivo** - KPIs claros e tabela consolidada
- ✅ **Edição Completa** - CRUD completo de lançamentos
- ✅ **Perfil Financeiro** - Configure seu planejamento ideal
- ✅ **Histórico** - Compare meses anteriores
- ✅ **Gráficos Interativos** - Visualize seus dados com Chart.js
- ✅ **Exportação PDF** - Imprima relatórios facilmente
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile

## 🗂️ Estrutura de Arquivos

```
📁 ERP-Financeiro/
├── 📄 index.html           # Tela de login/cadastro
├── 📄 dashboard.html       # Dashboard principal
├── 📄 perfil.html          # Configuração de perfil financeiro
├── 📄 historico.html       # Histórico de meses
├── 📄 charts.html          # Gráficos e visualizações
├── 📄 style.css            # Estilos globais
├── 📁 js/
│   └── 📄 dashboard.js     # Lógica principal do dashboard
└── 📄 README.md            # Este arquivo
```

## 🚀 Como Usar

### 1. Primeiro Acesso

1. Abra `index.html` no navegador
2. Crie sua conta com nome, e-mail e senha (mínimo 6 caracteres)
3. Faça login com suas credenciais

### 2. Configurar Perfil Financeiro

1. No dashboard, clique em **⚙️ Perfil**
2. Escolha um perfil sugerido ou personalize:
   - **Responsável**: 50% essenciais, 30% livres, 20% poupança
   - **Conservador**: 50% essenciais, 20% livres, 30% poupança
   - **Livre**: 50% essenciais, 40% livres, 10% poupança
3. Salve suas preferências

### 3. Registrar Lançamentos

#### Receitas
- Salário, rendas extras, reembolsos, rendimentos
- **Bancos**: Cartão, Itaú, Mercado Pago, Nubank, Clear

#### Poupança
- Reservas, investimentos, aplicações
- **Bancos**: Itaú, Mercado Pago, Nubank, Clear

#### Despesas
- **Essenciais**: Alimentação, moradia, saúde, transporte, educação...
- **Livres**: Lazer, viagens, vestuário, extras...
- **Bancos**: Cartão, Itaú, Mercado Pago, Nubank, Clear

### 4. Navegar entre Meses

- Use os botões **← Anterior**, **Mês Atual** e **Próximo →**
- Cada mês tem seus próprios dados isolados
- Acesse **📊 Histórico** para comparar meses

### 5. Visualizar Gráficos

Clique em **📊 Exportar Gráficos** para ver:
- 📊 Distribuição do orçamento (pizza)
- 📊 Receitas vs Despesas (barras)
- 📊 Despesas por categoria
- 📊 Evolução dos últimos 6 meses

### 6. Exportar Dados

- **PDF**: Use `Ctrl+P` ou botão "Imprimir"
- **Gráficos**: Acesse a página de gráficos e imprima

## 💾 Armazenamento de Dados

### LocalStorage Keys

```javascript
// Usuário
gf_erp_user          // Dados do usuário (nome, email, senha hash)
gf_erp_logged        // Status de login (true/false)

// Perfil Financeiro
gf_erp_perfil        // Configurações de perfil e percentuais

// Transações (por mês)
gf_erp_tx_2024-01    // Lançamentos de janeiro/2024
gf_erp_tx_2024-02    // Lançamentos de fevereiro/2024
// ... (um key por mês)
```

### Estrutura de Lançamento

```javascript
{
  id: "uuid-v4",                    // ID único
  tipo: "receita|despesa|poupanca", // Tipo de lançamento
  subtipo: "essencial|livre",       // Apenas para despesas
  data: "2024-01-15",               // Data no formato ISO
  valor: "1500.00",                 // Valor numérico
  categoria: "Salário",             // Categoria selecionada
  banco: "Itaú",                    // Banco/conta
  descricao: "Salário janeiro"      // Descrição opcional
}
```

## 📊 KPIs do Dashboard

| KPI | Descrição | Cálculo |
|-----|-----------|---------|
| **Renda Total** | Soma de todas as receitas | ∑ receitas |
| **Poupança Total** | Soma de todas as poupanças | ∑ poupanças |
| **Despesas Essenciais** | Soma das despesas obrigatórias | ∑ despesas essenciais |
| **Despesas Livres** | Soma das despesas opcionais | ∑ despesas livres |
| **Saldo a Distribuir** | Valor ainda não comprometido | Renda - Poupança - Desp. Essenciais - Desp. Livres |

## 🎨 Categorias Disponíveis

### Receitas
- Salário
- Renda Extra
- Reembolso
- Rendimentos
- Serviços

### Poupança
- Reserva
- Investimento
- Aplicação

### Despesas Essenciais
- ALIMENTAÇÃO ESSENCIAL
- ASSINATURAS ESSENCIAIS
- BEM-ESTAR ESSENCIAL
- COMUNICAÇÃO
- CUIDADO PESSOAL
- EDUCAÇÃO
- IMPOSTOS E TRIBUTOS
- SAÚDE
- TRANSPORTE
- MORADIA E SERVIÇOS ESSENCIAIS

### Despesas Livres
- LAZER E ENTRETENIMENTO
- ALIMENTAÇÃO FORA
- VESTUÁRIO
- VIAGENS E PASSEIOS
- MIMOS E EXTRAS

## 🔒 Segurança

- ✅ Senhas armazenadas com hash SHA-256
- ✅ Validação de formulários
- ✅ Proteção contra XSS
- ✅ Dados privados (localStorage local)

> ⚠️ **Importante**: Como os dados ficam no localStorage do navegador, não limpe o cache/cookies ou perderá todos os dados!

## 🐛 Resolução de Problemas

### Dados Não Aparecem
- Verifique se está no mês correto
- Use os botões de navegação de mês
- Confira o histórico de meses

### Erro ao Fazer Login
- Verifique e-mail e senha
- Crie uma nova conta se necessário
- Limpe o cache do navegador

### Gráficos Não Carregam
- Verifique conexão com internet (Chart.js via CDN)
- Atualize a página
- Tente outro navegador

### Perdi Meus Dados
- Dados ficam no localStorage do navegador
- Não podem ser recuperados após limpar cache
- Faça backup manual regularmente (exportar PDF)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1366px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

## 🎯 Roadmap Futuro

- [ ] Backup em nuvem (Google Drive, Dropbox)
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro automático
- [ ] Notificações de orçamento
- [ ] Importação de extratos bancários
- [ ] Metas financeiras
- [ ] Compartilhamento entre dispositivos
- [ ] Múltiplas contas/usuários

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura
- **CSS3** - Estilos e animações
- **JavaScript (Vanilla)** - Lógica
- **Chart.js 4.4** - Gráficos
- **LocalStorage API** - Persistência
- **Web Crypto API** - Hash de senhas

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins pessoais e educacionais.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para ajudar pessoas a terem controle financeiro.

---

**Versão**: 2.0.0  
**Última atualização**: Fevereiro 2025
