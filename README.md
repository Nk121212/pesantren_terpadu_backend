# Pesantren Backend (NestJS + Prisma)

### Prereqs

- Docker & Docker Compose OR Node 18+/Yarn & PostgreSQL running

### Run with Docker-compose (recommended)

1. Copy .env.example -> .env dan sesuaikan
2. docker-compose up --build

Perintah di container app akan menjalankan prisma generate + migrate dev otomatis (script bisa dimodifikasi)

### Run locally (without Docker)

1. yarn
2. copy .env.example -> .env
3. yarn prisma:generate
4. yarn prisma:migrate:dev --name init
5. yarn start:dev

### Test API (contoh)

- Create user:
  POST http://localhost:4000/api/users
  body: { "email":"demo@local","name":"Demo","password":"secret123" }

- Login:
  POST http://localhost:4000/api/auth/login
  body: { "email":"demo@local","password":"secret123" }

- Create invoice (auth optional for MVP):
  POST http://localhost:4000/api/invoices
  body: { "description":"SPP Juni","amount":150000 }

### Run migration & seed dev prisma

# Jalankan migrasi

npx prisma migrate dev --default init

# Atau untuk production

npx prisma migrate deploy

# Generate Prisma Client

npx prisma generate

npm run prisma:migrate -- --default init
npm run prisma:seed
