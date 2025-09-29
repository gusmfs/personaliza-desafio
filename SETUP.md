#  Setup da Aplicação
Node.js (versão 18 ou superior)
npm 

# Instalação

npm install

#Configuração do Banco de Dados

O banco SQLite será criado automaticamente na primeira execução. As tabelas são inicializadas automaticamente quando a aplicação é iniciada.

# INicializacáo

npm run dev
A aplicação estará disponível em: http://localhost:3000


#estrutura de Arquivos

database.sqlite` - Banco de dados SQLite (criado automaticamente)
uploads - pasta para arquivos anexados (criado automaticamente)

# Comandos Disponíveis

npm run dev - Inicia em modo desenvolvimento
npm run build - Gera build de produção
npm start - Inicia em modo produção~

# Observações

O banco de dados e diretório de uploads são criados automaticamente
a aplicação usa SQLite como banco de dados local
não há necessidade de configuração adicional para funcionamento básico