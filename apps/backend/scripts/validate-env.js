const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'CORS_ORIGIN'];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('Variáveis de ambiente obrigatórias ausentes:');
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
}

console.log('Todas as variáveis de ambiente obrigatórias estão presentes.');
