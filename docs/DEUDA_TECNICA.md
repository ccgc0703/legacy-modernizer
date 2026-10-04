# Deuda tecnica - DVWA

**Auditoria:** `scripts/audit-legacy.mjs`  
**Fecha:** 2026-10-03

## Inventario

| Metrica | Valor |
|---|---:|
| Archivos PHP | 169 |
| Lineas de codigo | 13.103 |
| Tablas SQL definidas | 11 |
| Modulos de vulnerabilidad | 19 |
| Hallazgos totales | 259 |

## Resumen de hallazgos

| ID | Severidad | Hallazgo | Ocurrencias | Archivos |
|---|---|---|---:|---:|
| MYSQL_EXT | CRITICA | API mysql_* eliminada en PHP 7 | 2 | 2 |
| EREG | CRITICA | ereg/split/each/create_function (fuera) | 0 | 0 |
| SQL_INJECT | CRITICA | SQL concatenado con $_GET/$_POST | 0 | 0 |
| EVAL | CRITICA | eval() dinamico | 2 | 1 |
| INCLUDE_VAR | ALTA | include/require con variable (RFI/LFI) | 1 | 1 |
| SERIALIZE | ALTA | unserialize() (inyeccion de objetos) | 0 | 0 |
| PASSWORD_MD5 | ALTA | Password guardado con md5/sha1 | 17 | 14 |
| SQL_VAR | ALTA | SQL concatenado con variables ($var) | 12 | 6 |
| PREGR_E | ALTA | preg_replace con modificador /e | 0 | 0 |
| ADDSLASHES | MEDIA | addslashes() como escape de SQL | 2 | 2 |
| HARDCODED | MEDIA | Credenciales/secretos hardcodeados | 15 | 14 |
| SUPERGLOB | INFO | Superglobales usadas en codigo | 208 | 70 |

### CRITICA - API mysql_* eliminada en PHP 7 (2 en 2 archivos)

- `vulnerabilities\sqli\help\help.php` — 1
- `vulnerabilities\sqli_blind\help\help.php` — 1

### CRITICA - eval() dinamico (2 en 1 archivos)

- `vulnerabilities\view_help.php` — 2

### ALTA - include/require con variable (RFI/LFI) (1 en 1 archivos)

- `vulnerabilities\fi\index.php` — 1

### ALTA - Password guardado con md5/sha1 (17 en 14 archivos)

- `vulnerabilities\captcha\source\impossible.php` — 3
- `vulnerabilities\csrf\source\impossible.php` — 2
- `login.php` — 1
- `vulnerabilities\brute\source\high.php` — 1
- `vulnerabilities\brute\source\impossible.php` — 1
- `vulnerabilities\brute\source\low.php` — 1
- `vulnerabilities\brute\source\medium.php` — 1
- `vulnerabilities\captcha\source\high.php` — 1
- `vulnerabilities\captcha\source\low.php` — 1
- `vulnerabilities\captcha\source\medium.php` — 1
- `vulnerabilities\csrf\source\high.php` — 1
- `vulnerabilities\csrf\source\low.php` — 1
- `vulnerabilities\csrf\source\medium.php` — 1
- `vulnerabilities\csrf\test_credentials.php` — 1

### ALTA - SQL concatenado con variables ($var) (12 en 6 archivos)

- `dvwa\includes\dvwaPage.inc.php` — 2
- `vulnerabilities\api\source\medium.php` — 2
- `vulnerabilities\authbypass\change_user_details.php` — 2
- `vulnerabilities\csrf\source\high.php` — 2
- `vulnerabilities\csrf\source\low.php` — 2
- `vulnerabilities\csrf\source\medium.php` — 2

### MEDIA - addslashes() como escape de SQL (2 en 2 archivos)

- `vulnerabilities\xss_s\source\high.php` — 1
- `vulnerabilities\xss_s\source\medium.php` — 1

### MEDIA - Credenciales/secretos hardcodeados (15 en 14 archivos)

- `vulnerabilities\api\src\Login.php` — 2
- `login.php` — 1
- `vulnerabilities\brute\source\high.php` — 1
- `vulnerabilities\brute\source\low.php` — 1
- `vulnerabilities\brute\source\medium.php` — 1
- `vulnerabilities\captcha\source\high.php` — 1
- `vulnerabilities\captcha\source\low.php` — 1
- `vulnerabilities\captcha\source\medium.php` — 1
- `vulnerabilities\cryptography\source\token_library_high.php` — 1
- `vulnerabilities\cryptography\source\token_library_impossible.php` — 1
- `vulnerabilities\csrf\source\low.php` — 1
- `vulnerabilities\csrf\source\medium.php` — 1
- `vulnerabilities\csrf\test_credentials.php` — 1
- `vulnerabilities\sqli\test.php` — 1

### INFO - Superglobales usadas en codigo (208 en 70 archivos)

- `dvwa\includes\dvwaPage.inc.php` — 10
- `vulnerabilities\captcha\source\medium.php` — 10
- `vulnerabilities\bac\source\low.php` — 9
- `vulnerabilities\captcha\source\low.php` — 9
- `vulnerabilities\bac\source\medium.php` — 6
- `vulnerabilities\brute\source\impossible.php` — 6
- `vulnerabilities\captcha\source\impossible.php` — 6
- `vulnerabilities\captcha\source\high.php` — 5
- `vulnerabilities\csrf\source\impossible.php` — 5
- `login.php` — 4
- `vulnerabilities\api\src\LoginController.php` — 4
- `vulnerabilities\bac\source\high.php` — 4
- `vulnerabilities\bac\source\impossible.php` — 4
- `vulnerabilities\brute\source\high.php` — 4
- `vulnerabilities\xss_s\source\impossible.php` — 4

## Notas manuales (completar)

- [ ] Framework + version PHP de DVWA (ver README.md)
- [ ] **Flujo critico:** login -> modulo -> BD (describe la ruta concreta)
- [ ] Superficie de vistas/endpoints -> esfuerzo de Fase 2
- [ ] Cual es la vulnerabilidad mas repetida y por que
