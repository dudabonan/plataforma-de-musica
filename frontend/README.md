# Plataforma de música

Interface Next.js com React, TypeScript, Tailwind CSS e fonte Poppins. Permite selecionar usuários, buscar músicas, listar favoritos, filtrar por estilo e consultar as músicas mais ouvidas. Favoritos e acessos são registrados pela API Flask no PostgreSQL.

## Executar localmente

Na raiz do projeto, com as dependências Python instaladas (`flask`, `flask-cors`, `psycopg2`, `python-dotenv`), configure o `.env` com `HOST`, `DB_USER`, `PASSWD` e `DATABASE`. As opções `DB_PORT` e `DB_SSLMODE` são opcionais. O banco deve estar criado e populado.

Inicie o backend em um terminal:

```bash
python app.py
```

Em outro terminal, instale as dependências e inicie o frontend:

```bash
cd frontend
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A API usa `http://localhost:5000` por padrão; para outro endereço, defina `NEXT_PUBLIC_API_URL` no arquivo `frontend/.env.local`.

## Verificação

Na pasta `frontend`:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

O clique na capa registra um acesso e atualiza a capa exibida. O projeto atual não reproduz áudio; os controles do player são visuais.
