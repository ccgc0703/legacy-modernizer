import fs from 'node:fs';
import path from 'node:path';

// ── Configuración ──────────────────────────────────────────────
// Forma: node scripts\audit-legacy.mjs <carpeta> <salida>
const target  = path.resolve(process.argv[2] ?? 'legacy/dvwa');
const outFile = path.resolve(process.argv[3] ?? 'docs/DEUDA_TECNICA.md');

if (!fs.existsSync(target)) {
  console.error('No existe la carpeta:', target);
  console.error('Ejecuta desde la raiz del proyecto:');
  console.error('  node scripts\\audit-legacy.mjs legacy\\dvwa docs\\DEUDA_TECNICA.md');
  process.exit(1);
}

// ── Patrones de deuda técnica ──────────────────────────────────
// re = expresion regular; g = global (busca TODAS las coincidencias)
const PATTERNS = [
  { id:'MYSQL_EXT',    sev:'CRITICA', label:'API mysql_* eliminada en PHP 7',        re:/\bmysql_(query|connect|pconnect|fetch_array|fetch_row|real_escape_string|select_db)\s*\(/g },
  { id:'EREG',         sev:'CRITICA', label:'ereg/split/each/create_function (fuera)',re:/\b(ereg|eregi|ereg_replace|split|each|create_function)\s*\(/g },
  { id:'SQL_INJECT',   sev:'CRITICA', label:'SQL concatenado con $_GET/$_POST',       re:/\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b[^;]*\$_(GET|POST|REQUEST|COOKIE)/is },
  { id:'EVAL',         sev:'CRITICA', label:'eval() dinamico',                        re:/\beval\s*\(/g },
  { id:'INCLUDE_VAR',  sev:'ALTA',    label:'include/require con variable (RFI/LFI)', re:/\b(include|require)(_once)?\s*\(?\s*\$/g },
  { id:'SERIALIZE',    sev:'ALTA',    label:'unserialize() (inyeccion de objetos)',   re:/\bunserialize\s*\(/g },
  { id:'PASSWORD_MD5', sev:'ALTA',    label:'Password guardado con md5/sha1',         re:/(pass|pwd|password)[a-z_]*\s*(=>|=)[^;\n]{0,60}\b(md5|sha1)\s*\(/gi },
  { id:'SQL_VAR',      sev:'ALTA',    label:'SQL concatenado con variables ($var)',   re:/\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b[^;]*\.\s*\$/is },
  { id:'PREGR_E',      sev:'ALTA',    label:'preg_replace con modificador /e',        re:/preg_replace\s*\(\s*["'][^"']*\/[a-z]*e[a-z]*["']/g },
  { id:'ADDSLASHES',   sev:'MEDIA',   label:'addslashes() como escape de SQL',        re:/\baddslashes\s*\(/g },
  { id:'HARDCODED',    sev:'MEDIA',   label:'Credenciales/secretos hardcodeados',     re:/(password|passwd|secret|api_key|token)\s*=\s*["'][^"'\n]{4,}["']/gi },
  { id:'SUPERGLOB',    sev:'INFO',    label:'Superglobales usadas en codigo',         re:/\$_(GET|POST|REQUEST|COOKIE)\[/g },
];

// ── Recorrer el arbol de carpetas ──────────────────────────────
const files = [];
let sqlTables = 0;

(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    const low = e.name.toLowerCase();
    if (low.endsWith('.php')) files.push(p);
    if (low.endsWith('.sql')) {
      const n = (fs.readFileSync(p, 'utf8').match(/CREATE TABLE/gi) ?? []).length;
      sqlTables += n;
    }
  }
})(target);

// ── Analizar cada archivo contra cada patron ───────────────────
let totalLoc = 0;
const results = PATTERNS.map(p => ({ ...p, hits: 0, files: new Map() }));

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  totalLoc += src.split('\n').length;
  const rel = path.relative(target, f);
  for (const r of results) {
    const m = src.match(r.re);            // match con /g devuelve TODAS las coincidencias
    if (m) { r.hits += m.length; r.files.set(rel, m.length); }
  }
}

// ── Ordenar por severidad y resumir ────────────────────────────
const order = { CRITICA:0, ALTA:1, MEDIA:2, INFO:3 };
results.sort((a,b) => order[a.sev] - order[b.sev]);
const totalAll = results.reduce((s,r) => s + r.hits, 0);

const mods = fs.existsSync(path.join(target,'vulnerabilities'))
  ? fs.readdirSync(path.join(target,'vulnerabilities'), { withFileTypes:true })
      .filter(e => e.isDirectory()).length : 0;

// ── Generar el reporte Markdown ────────────────────────────────
let md = `# Deuda tecnica - DVWA\n\n`;
md += `**Auditoria:** \`scripts/audit-legacy.mjs\`  \n`;
md += `**Fecha:** ${new Date().toISOString().slice(0,10)}\n\n`;

md += `## Inventario\n\n`;
md += `| Metrica | Valor |\n|---|---:|\n`;
md += `| Archivos PHP | ${files.length} |\n`;
md += `| Lineas de codigo | ${totalLoc.toLocaleString()} |\n`;
md += `| Tablas SQL definidas | ${sqlTables} |\n`;
md += `| Modulos de vulnerabilidad | ${mods} |\n`;
md += `| Hallazgos totales | ${totalAll} |\n\n`;

md += `## Resumen de hallazgos\n\n`;
md += `| ID | Severidad | Hallazgo | Ocurrencias | Archivos |\n|---|---|---|---:|---:|\n`;
for (const r of results) md += `| ${r.id} | ${r.sev} | ${r.label} | ${r.hits} | ${r.files.size} |\n`;
md += `\n`;

for (const r of results.filter(r => r.hits > 0)) {
  md += `### ${r.sev} - ${r.label} (${r.hits} en ${r.files.size} archivos)\n\n`;
  [...r.files.entries()].sort((a,b)=>b[1]-a[1]).slice(0,15)
    .forEach(([f,n]) => { md += `- \`${f}\` — ${n}\n`; });
  md += `\n`;
}

md += `## Notas manuales (completar)\n\n`;
md += `- [ ] Framework + version PHP de DVWA (ver README.md)\n`;
md += `- [ ] **Flujo critico:** login -> modulo -> BD (describe la ruta concreta)\n`;
md += `- [ ] Superficie de vistas/endpoints -> esfuerzo de Fase 2\n`;
md += `- [ ] Cual es la vulnerabilidad mas repetida y por que\n`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, md, 'utf8');

console.log(`Listo: ${files.length} archivos PHP | ${totalLoc} LOC | ${sqlTables} tablas | ${totalAll} hallazgos`);
console.log(`Reporte: ${outFile}`);