# Estratégia de testes

O FinControl utiliza TDD e testes automatizados como parte dos quality gates do desenvolvimento.

## O que este showcase demonstra

A amostra pública inclui testes de regras de período financeiro sem depender de interface, banco de dados ou serviços externos. Isso permite validar comportamento de negócio de forma rápida e determinística.

### Casos cobertos

- semana civil iniciando na segunda-feira;
- janela móvel de 7 dias;
- quinzena civil;
- janela móvel de 15 dias;
- competência mensal;
- virada de mês e de ano;
- fevereiro em ano bissexto;
- rejeição de datas inválidas;
- fronteiras semiabertas `[início, fim)`.

## Quality gates usados no projeto completo

```text
lint
→ type-check
→ testes automatizados
→ auditoria de dependências
→ build
```

Além dos testes de domínio apresentados aqui, o projeto privado contém testes de componentes, integração com repositórios, contratos de banco e políticas RLS.

## Por que isso importa

Separar regras de negócio da infraestrutura permite detectar regressões antes de envolver UI ou banco de dados. Para um domínio financeiro, isso reduz ambiguidades em datas, valores monetários e transições entre períodos.
