# 🔁 Legacy Modernizer

**Case study y kit de metodología para migrar sistemas heredados PHP 5 / CodeIgniter 2 → PHP 8.3 / Laravel 11, con estándares de ingeniería modernos.**

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)
![Rector](https://img.shields.io/badge/Rector-automated%20refactoring-E0234E)
![PHPStan](https://img.shields.io/badge/PHPStan-level%20max-3967BC?logo=phpstan&logoColor=white)
![Pest](https://img.shields.io/badge/Pest-testing-2B8A3E)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> **La historia:** en 2025 migré el sistema **PROCSI** (PDVSA — Centro de Refinación Paraguaná) de PHP 5 / CodeIgniter 2.7 a PHP 8 / CodeIgniter 4. Este proyecto replica esa misma metodología sobre código legacy **abierto**, llevándola al estándar de 2026: Laravel 11, análisis estático de nivel máximo, tests desde el día uno y CI/CD.

---

## 📌 Objetivo

| | |
|---|---|
| **Qué es** | Un repositorio-monorepo donde un sistema PHP legacy real se migra de forma incremental y documentada a PHP 8.3 + Laravel 11 |
| **Qué NO es** | Un tutorial de Laravel ni un "hello world" con CI |
| **A quién le sirve** | A quien contrata: muestra criterio de ingeniería sobre sistemas heredados. A quien aprende: un plan de migración ejecutable paso a paso |
| **Resultado esperado** | Sistema objetivo con: PHPStan nivel máximo ✅, cobertura de tests ≥ 70% ✅, CI verde ✅, despliegue en Docker ✅ |

---

## 🛠 Stack y herramientas

**Destino (modern/):**

| Capa | Tecnología |
|---|---|
| Runtime | PHP 8.3 |
| Framework | Laravel 11 (eloquent, form requests, policies, queues) |
| Base de datos | MySQL 8 / PostgreSQL 16 |
| Tests | Pest (PHPUnit) + cobertura ≥ 70% |
| Análisis estático | PHPStan nivel máximo + Larastan |
| Refactoring automatizado | Rector (set `php83`, sets de Laravel) |
| Código style | Laravel Pint |
| Infra | Docker Compose, GitHub Actions (CI/CD) |

**Origen (legacy/):** el código base original, congelado sin tocar (firma de la migración).

---

## 📂 Estructura

```
legacy-modernizer/
├── README.md                  ← estás aquí
├── docker-compose.yml         ← entorno: php, mysql, redis
├── .github/
│   └── workflows/
│       └── ci.yml             ← CI: pint + phpstan + pest + rector --dry-run
├── legacy/                    ← código legacy ORIGINAL, congelado (solo lectura)
│   └── (código base PHP 5 / CI 2.7)
├── modern/                    ← aplicación Laravel 11 (destino de la migración)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Policies/          ← RBAC/ABAC (herencia del caso PROCSI)
│   │   ├── Services/
│   │   └── Support/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── tests/
│   │   ├── Feature/
│   │   └── Unit/
│   ├── rector.php
│   ├── phpstan.neon
│   └── composer.json
├── scripts/                   ← utilidades de la migración
│   ├── audit-legacy.mjs       ← Fase 0: barrido de deuda técnica
│   ├── generate-mapping.php   ← tabla de correspondencia legacy → Laravel
│   └── compare-endpoints.php  ← verificación de paridad funcional
└── docs/
    ├── MIGRATION_PLAN.md      ← plan en 5 fases con checklists
    ├── REPOS_CANDIDATOS.md    ← dónde conseguir código legacy real
    ├── CHANGELOG_MIGRACION.md ← registro de cada módulo migrado
    └── ARCHITECTURE.md        ← arquitectura antes/después
```

---

## 🗺 Metodología en 5 fases

El mismo enfoque usado en PROCSI (diagnóstico → diseño → construcción → validación), con las herramientas de 2026.

### Fase 0 — Diagnóstico de deuda técnica *(legacy/)*
- Subir el código legacy tal cual y **congelarlo**.
- Ejecutar `scripts/audit-legacy.mjs`: detecta `mysql_*`, `ereg`, funciones deprecadas, SQL embebido, `md5` para passwords, etc.
- Generar **inventario**: controllers, modelos, rutas, tablas, endpoints.
- 📄 Salida: `docs/DEUDA_TECNICA.md`

### Fase 1 — Arquitectura objetivo *(modern/)*
- Scaffolding Laravel 11 + Docker.
- **Tabla de mapeo**: cada ruta/controlador/clase legacy → destino Laravel.
- Mapear modelo de datos → migraciones Eloquent.
- Definir estrategia de autenticación y RBAC.
- 📄 Salida: `docs/ARCHITECTURE.md` + `docs/MAPPING.md`

### Fase 2 — Migración incremental *(módulo a módulo)*
- Regla de oro: **un módulo a la vez**, siempre con tests de caracterización primero.
- Orden sugerido: autenticación → CRUD base → módulos de negocio → reportes.
- Cada módulo: tests verdes + PHPStan limpio + Pint limpio → se fusiona.
- 📄 Salida: `docs/CHANGELOG_MIGRACION.md`

### Fase 3 — Blindaje y calidad
- PHPStan a nivel máximo (0 errores baseline).
- Cobertura ≥ 70% (`pest --coverage`).
- Rector en CI (`--dry-run`) para que nadie reintroduzca código pre-PHP 8.

### Fase 4 — Validación de paridad y despliegue
- `scripts/compare-endpoints.php`: mismas respuestas en legacy vs moderno.
- Smoke tests E2E del flujo crítico.
- Docker up + despliegue (Render / Railway / VPS).

---

## ▶️ Cómo ejecutar

```bash
git clone https://github.com/TU-USUARIO/legacy-modernizer.git
cd legacy-modernizer
cp .env.example .env          # configurar credenciales
docker compose up -d
docker compose exec app composer install
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan test
```

**Quality gates (todo debe pasar antes de mergear):**

```bash
./vendor/bin/pint             # style
./vendor/bin/phpstan analyse  # estático (nivel máximo)
./vendor/bin/rector --dry-run # nada de código pre-PHP8
./vendor/bin/pest --coverage  # ≥ 70%
```

---

## ✅ Roadmap

- [x] **Fase 0:** elegir código base legacy → **DVWA** (`digininja/DVWA`), ver `docs/REPOS_CANDIDATOS.md`
- [x] **Fase 0:** congelar `legacy/` + audit + inventario
- [ ] **Fase 1:** scaffold Laravel 11 + Docker + tabla de mapeo
- [ ] **Fase 2:** migrar módulo de autenticación
- [ ] **Fase 2:** migrar CRUDs de negocio
- [ ] **Fase 3:** PHPStan nivel máximo + cobertura ≥ 70%
- [ ] **Fase 4:** paridad de endpoints + despliegue en vivo
- [ ] **Post:** blog técnico "De PHP 5 a PHP 8.3: lo que aprendí migrando PROCSI"

---

## 📄 Licencia

MIT © 2026 Carlos Granadillo

> **Nota de confidencialidad:** el código de PROCSI (PDVSA) es propiedad de la empresa y **no** se incluye aquí. La metodología, los diagramas y las lecciones aprendidas sí son reproducibles sobre cualquier base legacy abierta.
