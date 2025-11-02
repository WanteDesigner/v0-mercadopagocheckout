# Como Acessar a Lista de Emails

A lista de emails dos clientes que geraram PIX QR Code está sendo salva automaticamente no arquivo `data/lista de emails.txt`.

## Acessar o Arquivo

### Opção 1: Download via API
Acesse a URL: `/api/emails/save` (método GET) para baixar o arquivo diretamente.

### Opção 2: Arquivo Local
O arquivo está localizado em: `data/lista de emails.txt`

## Formato do Arquivo

Cada linha contém:
\`\`\`
Data/Hora | Email | Valor | Produtos
\`\`\`

Exemplo:
\`\`\`
02/11/2025 14:30:45 | cliente@email.com | R$ 15.00 | Desenho Completo: A turma de Charlie Brown, A Formiga Atômica
\`\`\`

## Enviar para GitHub

Para enviar o arquivo para o GitHub:

1. Adicione o arquivo ao git:
\`\`\`bash
git add data/lista\ de\ emails.txt
\`\`\`

2. Faça o commit:
\`\`\`bash
git commit -m "Atualizar lista de emails"
\`\`\`

3. Envie para o GitHub:
\`\`\`bash
git push origin main
\`\`\`

## Automação

O arquivo é atualizado automaticamente sempre que um cliente gera um PIX QR Code. Você pode fazer commits periódicos para manter o histórico no GitHub.
