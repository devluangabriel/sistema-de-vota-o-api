# Sistema de Votação com Express e MongoDB

Este projeto é uma API simples de votação desenvolvida com Node.js, Express e MongoDB. Ele permite que usuários registrem votos e obtenham os resultados da votação, garantindo que cada voto seja único por nome ou IP.

## Tecnologias Utilizadas
- Node.js
- Express.js
- MongoDB com Mongoose
- CORS
- dotenv
- request-ip

## Configuração do Projeto
### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione:
```
PORT=5000
MONGO_URI=sua_string_de_conexao_com_mongodb
```

### 4. Executar o Servidor
```bash
npm start
```
O servidor será iniciado na porta definida em `PORT` ou na 5000 por padrão.

## Rotas da API
### 1. Registrar um Voto
**POST** `/votar`
#### Requisição:
```json
{
  "nome": "João",
  "grupo": "feijoada"
}
```
#### Respostas:
- `201` - Voto registrado com sucesso
- `400` - Nome ou IP já votaram
- `400` - Erro ao registrar o voto

### 2. Obter Resultados
**GET** `/resultados`
#### Resposta:
```json
[
  {
    "grupo": "feijoada",
    "total": 10,
    "imagem": "imagems/grupos/2.png"
  }
]
```

### 3. Resetar Votação
**DELETE** `/resetar`
#### Respostas:
- `200` - Votacão resetada com sucesso
- `500` - Erro ao resetar a votação

## Estrutura do Projeto
```
/
├── node_modules/
├── imagens/grupos/  # Diretório de imagens das bandeiras
├── .env
├── package.json
├── server.js  # Arquivo principal da API
```

## Considerações Finais
Este projeto foi criado para fins educativos e pode ser expandido conforme necessário. Sinta-se à vontade para contribuir ou modificar o código conforme suas necessidades.
