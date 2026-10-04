# 📚 Repositorios candidatos — dónde conseguir código legacy real

> ## ✅ CANDIDATO ELEGIDO: **DVWA — Damn Vulnerable Web App**
> `https://github.com/digininja/DVWA` — ver detalle en el Top 3, punto 1.
> Razón: combina **legacy PHP + seguridad** (certificación Cisco + módulo de auditoría de PROCSI), tamaño manejable y licencia clara.
> Próximo paso: clonar en `legacy/`, registrar commit y licencia en `SOURCE.md`, ejecutar Fase 0.

Criterio de selección: (1) sea **real** (no un tutorial), (2) tenga **deuda técnica visible**, (3) sea **pequeño** para terminarlo (< 20k LOC), (4) licencia permisiva (MIT/GPL), (5) preferiblemente en **español** o dominio conocido (mejor historia para el CV).

---

## 🥇 Top 3 recomendados

### 1. DVWA — Damn Vulnerable Web App
- **Repo:** https://github.com/digininja/DVWA
- **Qué es:** app PHP deliberadamente vulnerable, mantenida hace 15+ años.
- **Por qué:** combina **legacy PHP + seguridad** (tu certificación Cisco + módulo de auditoría de PROCSI). La migración no es solo "pasar a Laravel": es **cerrar las vulnerabilidades con tests** (SQLi, XSS, CSRF → policies, prepared statements, CSRF tokens, rate limiting).
- **Alcance estimado:** 3-4 semanas.
- **Historia en el CV:** *"Migración de DVWA (PHP legacy) a Laravel 11, cerrando 8 vulnerabilidades OWASP Top 10 con tests de seguridad."*

### 2. Pequeños sistemas en CodeIgniter 2 abandonados (los más parecidos a PROCSI)
- **Dónde:**
  - GitHub → buscar `topic:codeigniter-2` o `topic:codeigniter2`
  - Búsqueda avanzada: `language:PHP "codeigniter" created:2012..2017 pushed:<2018-01-01`
  - En español: `sistema codeigniter 2`, `sistema academico codeigniter`, `sistema de notas CI2`, `plataforma codeigniter mysql`
  - GitLab y SourceForge con filtros similares
- **Por qué:** son CRUDs institucionales exactamente como PROCSI (usuarios, roles, reportes PDF, DataTables + jQuery). La similitud hace que tu experiencia sea 100% transferible.
- **A revisar:** existe el topic `codeigniter-2` con cientos de repos; filtra por estrellas > 5 o por última actualización pre-2018.
- **Alcance estimado:** 2-4 semanas según tamaño.

### 3. Tu propio código anterior (JSCAMP, gestor-financiero v1)
- **Dónde:** en tu máquina (`C:\Users\carlo\PROYECTOS\`).
- **Por qué:** 100% honesto, controlas el alcance, no hay problemas de licencia, y la historia es real: *"mi código de 2023 vs mi código de 2026"*.
- **Variante potente:** migrar `gestor-financiero` (backend Express/Prisma) a arquitectura más sólida, o tomar la versión vieja de cualquier repo y dejarla en `legacy/`.

---

## 🥈 Otras opciones (según ambición)

| Proyecto | Dónde | Nota |
|---|---|---|
| **FrontAccounting ERP** | frontaccounting.github.io / GitHub | ERP PHP real con MUCHA deuda técnica; grande — úsalo solo si quieres un proyecto de 2+ meses |
| **TCExam** | SourceForge | Plataforma de exámenes PHP legacy |
| **PHP-Fusion** | php-fusion.org / GitHub | CMS PHP antiguo, arquitectura interesante |
| **osCommerce / forks Magento 1** | GitHub | Mercado enorme de migración, pero demasiado grande para un portafolio |
| **Drupal 7** | drupal.org | Drupal 7 llegó EOL; migrar módulos D7 → Drupal 11 es un nicho muy demandado (pero es PHP distinto a Laravel) |
| **Búsquedas "abandoned" en Packagist** | packagist.org → filtrar `is:abandoned` | Sirve para libs, no para apps; descartar |

---

## 🔍 Búsquedas en GitHub que funcionan

```
# Repos PHP viejos y sin tocar
language:PHP pushed:<2017-01-01 stars:>10

# CodeIgniter 2 específicamente
language:PHP "codeigniter 2" pushed:<2018-01-01

# Señales de PHP pre-7 (buenísimo filtro)
language:PHP "mysql_query" OR "ereg(" OR "split("

# Tema
topic:codeigniter-2

# En español
language:PHP sistema codeigniter mysql created:<2017
```

---

## ⚖️ Antes de clonar — checklist legal

- [ ] ¿Tiene `LICENSE`? (MIT / Apache / GPL son usables; GPL obliga a abrir tu versión)
- [ ] Sin licencia = **no lo publiques**; puedes usarlo solo como referencia local
- [ ] ¿Contiene datos personales o credenciales? → scrub antes de subir
- [ ] Guardar el commit hash original en `legacy/SOURCE.md` (procedencia)

---

## ✍️ Recomendación final

**Empieza con la opción 2** (un CRUD en CodeIgniter 2 en español, < 5k LOC): es lo más parecido a PROCSI, terminas rápido y tienes tu primer case study completo. **Después** ataca DVWA como proyecto 2 (el de seguridad, el que te diferencia).

> Regla de PM: **terminar algo pequeño y publicado** vale 10× más que empezar algo grande y abandonado.
