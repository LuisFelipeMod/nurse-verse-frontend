# NurseVerse Frontend

Frontend do sistema NurseVerse, uma plataforma para gerenciamento de documentos e processos de enfermagem.

## 🚀 Tecnologias

Este projeto foi construído com as seguintes tecnologias principais:

- [Vue 3](https://vuejs.org/) - Framework JavaScript Progressivo
- [Vite](https://vitejs.dev/) - Build tool de próxima geração
- [Pinia](https://pinia.vuejs.org/) - Gerenciamento de estado intuitivo para Vue
- [Vue Router](https://router.vuejs.org/) - Roteador oficial para Vue.js
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário para estilização rápida
- [Axios](https://axios-http.com/) - Cliente HTTP baseado em Promise
- [Headless UI](https://headlessui.com/) & [Heroicons](https://heroicons.com/) - Componentes de UI e ícones

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/) (versão 16.0 ou superior recomendada)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

## 🔧 Instalação

1. Clone o repositório (se ainda não o fez):
   ```bash
   git clone <url-do-repositorio>
   cd nurse-verse/frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## ⚙️ Configuração

O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz do projeto `frontend` baseado no exemplo fornecido:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário. As principais variáveis são:

- `VITE_API_URL`: URL da API backend (ex: `http://localhost:3000/api`)
- `VITE_APP_NAME`: Nome da aplicação
- `VITE_APP_VERSION`: Versão da aplicação

## 🏃‍♂️ Scripts Disponíveis

No diretório do projeto, você pode rodar:

### `npm run dev`
Inicia a aplicação em modo de desenvolvimento.\
Abra [http://localhost:5173](http://localhost:5173) (ou a porta indicada) para ver no navegador.

### `npm run build`
Compila a aplicação para produção na pasta `dist`.\
Gera arquivos estáticos otimizados prontos para deploy.

### `npm run preview`
Visualiza a versão de produção localmente após o build.

### `npm run lint`
Executa o ESLint para encontrar e corrigir problemas no código.

## 📂 Estrutura do Projeto

```
src/
├── assets/        # Arquivos estáticos (imagens, fontes, etc)
├── components/    # Componentes Vue reutilizáveis
├── router/        # Configuração de rotas
├── services/      # Serviços de API e lógica de negócios
├── stores/        # Stores do Pinia para gerenciamento de estado
├── utils/         # Funções utilitárias
├── views/         # Componentes de página (telas)
├── App.vue        # Componente raiz
├── main.js        # Ponto de entrada da aplicação
└── style.css      # Estilos globais (Tailwind imports)
```
