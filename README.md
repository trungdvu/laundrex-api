# Laundrex api

## Overview

- AWS EC2
- ZeroSSL
- NestJS

## Setup

1. Install dependencies

```bash
  npm install
```

2. Add `.env` file with files in `.env.example`

3. Start the dev server

```bash
  npm run start:dev
```

## Database migration

Auto generate migration

```bash
  npm run migration:generate -- db/migrations/[name]
```

Run migration

```bash
  npm run migration:run
```

## Dev with docker compose

Start services

```bash
  docker compose up -d
```

Run migrations

```bash
  docker exec server npm run migration:run
```
