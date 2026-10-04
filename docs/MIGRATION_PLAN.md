# 🗺 Plan de Migración — 5 fases

> Inspirado en la metodología del informe PROCSI (PDVSA/UNEFA, ene 2026): cascada con validación por fase, adaptada a integración continua.

---

## Fase 0 — Diagnóstico de deuda técnica

**Objetivo:** conocer el terreno antes de tocar una línea del destino.

- [x] Elegir código base (ver `REPOS_CANDIDATOS.md`) y registrarlo en `legacy/SOURCE.md` (URL + commit hash + licencia)
- [x] Clonar en `legacy/` y **congelarlo** (nunca se edita; solo se lee)
- [x] Ejecutar `scripts/audit-legacy.mjs` → `docs/DEUDA_TECNICA.md`
  - Funciones deprecadas/eliminadas: `mysql_*`, `ereg`, `split`, `create_function`, `each`
  - SQL embebido / sin prepared statements
  - Passwords con `md5`/`sha1`
  - Archivos sin namespace, `include` dinámicos
- [x] Inventario de superficie: rutas, controllers, modelos, tablas, vistas, jobs
- [x] Identificar el **flujo crítico** (la función por la que vive el sistema) — de PROCSI fue el boletín "Aprender-Aprender"
- [x] Estimación de tamaño: LOC, nº de módulos, complejidad

**Salida:** `docs/DEUDA_TECNICA.md` + `legacy/SOURCE.md`

---

## Fase 1 — Arquitectura objetivo

**Objetivo:** diseñar el destino antes de construir (MVC estricto, como en PROCSI).

- [ ] Scaffold Laravel 11 en `modern/` + Docker Compose
- [ ] `composer require --dev` : `larastan/larastan`, `pestphp/pest`, `rector/rector`, `laravel/pint`
- [ ] Tabla de mapeo `docs/MAPPING.md`:

  | Legacy (ruta / clase) | Laravel destino | Módulo | Prioridad | Estado |
  |---|---|---|---|---|
  | `login/index` | `AuthController@login` | auth | P0 | ⬜ |

- [ ] Modelo de datos → migraciones Eloquent (respetando nombres de columnas legacy para minimizar riesgo)
- [ ] Estrategia de auth (Breeze/Sanctum) y **RBAC/lessons de PROCSI**: roles + permisos, o policies por propiedad (ABAC)
- [ ] Definir envs, seeds de datos de prueba

**Salida:** `docs/ARCHITECTURE.md` + `docs/MAPPING.md`

---

## Fase 2 — Migración incremental (módulo a módulo)

**Reglas de oro:**
1. **Tests primero:** por cada endpoint legacy, escribir test de caracterización en Laravel antes de migrar la lógica.
2. **Un módulo a la vez** — nunca ramas vivas de meses.
3. **Nada de "big bang"** — el sistema legacy sigue funcionando hasta el corte.

Orden recomendado:
- [ ] P0: autenticación + usuarios + roles
- [ ] P0: flujo crítico del negocio
- [ ] P1: CRUDs secundarios
- [ ] P2: reportes / exportaciones / PDF

Por cada módulo:
- [ ] Tests verdes (`php artisan test`)
- [ ] PHPStan sin errores nuevos
- [ ] Pint limpio
- [ ] Registrar en `docs/CHANGELOG_MIGRACION.md`

**Salida:** módulo migrado + entrada en changelog

---

## Fase 3 — Blindaje de calidad

- [ ] PHPStan/Larastan a **nivel máximo** con baseline en cero
- [ ] Cobertura ≥ 70% (`./vendor/bin/pest --coverage-html`)
- [ ] Rector con sets `php83` + laravel en modo `--dry-run` dentro de CI
- [ ] Pint con preset laravel
- [ ] Secrets fuera del repo (`.env.example` completo y limpio)

---

## Fase 4 — Validación de paridad y despliegue

- [ ] `scripts/compare-endpoints.php`: legacy vs moderno, misma respuesta
- [ ] Smoke test E2E del flujo crítico (Playwright o Pest + Dusk)
- [ ] Migración de datos reales (o seed representativo) + conteo de filas
- [ ] `docker compose up` documentado en ≤ 3 comandos
- [ ] Despliegue: Render / Railway / VPS + dominio
- [ ] README final con capturas y arquitectura

**Salida:** demo en vivo + tag `v1.0.0`

---

## Post — Difusión (lo que convierte código en empleo)

- [ ] Blog/README: **"De PHP 5 a PHP 8.3: migrando un sistema real sin romperlo"**
- [ ] Artículo en LinkedIn con capturas del dashboard de PHPStan antes/después
- [ ] Subir al CV y a la sección de proyectos
- [ ] Si sobra energía: extraer `scripts/audit-legacy.mjs` como **CLI publicable en npm**

---

## ⏱ Ritmo sugerido

| Semana | Fase |
|---|---|
| 1 | Fase 0 (elegir + congelar + inventario) |
| 2 | Fase 1 (scaffold + mapeo) |
| 3-5 | Fase 2 (módulos P0) |
| 6 | Fase 2 restante + Fase 3 |
| 7 | Fase 4 + publicación |

**Regla de PM:** si algo lleva más de 1 semana sin resultados visibles, se parte en dos.
