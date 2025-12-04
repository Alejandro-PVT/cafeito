# Inicio Rápido - CafeITO

## En 5 minutos

### 1. Setup Local (Windows, Mac, Linux)

\`\`\`bash
# Descargar/clonar proyecto
cd cafeito-pos

# Instalar dependencias
npm install

# Crear y editar .env.local
cp .env.local.example .env.local
# Editar con tus credenciales MySQL
\`\`\`

### 2. Crear Base de Datos

**Opción A: MySQL local**
\`\`\`bash
mysql -u root -p < scripts/init-database.sql
\`\`\`

**Opción B: MySQL desde GUI**
- Abrir MySQL Workbench
- Copiar contenido de \`scripts/init-database.sql\`
- Ejecutar en query

### 3. Correr Localmente

\`\`\`bash
npm run dev
\`\`\`

Visitar:
- Cliente: http://localhost:3000
- Admin: http://localhost:3000/admin
- Usuario demo: admin@cafeito.com / admin123

---

## Desplegar en Render (10 minutos)

### 1. Preparar Git
\`\`\`bash
git init
git add .
git commit -m "CafeITO POS"
git push origin main
\`\`\`

### 2. Crear DB en PlanetScale
- Ir a planetscale.com
- Crear BD "cafeito_db"
- Generar password
- Ejecutar script SQL con credenciales nuevas

### 3. Crear Web Service en Render
- dashboard.render.com → "New Web Service"
- Conectar GitHub
- Agregar variables de entorno
- Deploy automático

### 4. Listo!
Tu sitio estará en: https://tu-app.onrender.com

---

## URLs Importantes

| Función | URL |
|---------|-----|
| Cliente | https://tu-app.onrender.com |
| Admin Login | https://tu-app.onrender.com/admin |
| API Productos | https://tu-app.onrender.com/api/products |
| API Órdenes | https://tu-app.onrender.com/api/orders |

---

## Credenciales Demo

\`\`\`
Email: admin@cafeito.com
Password: admin123
\`\`\`

---

## Variables Render (Environment)

\`\`\`
DB_HOST=xxx.us-east-2.psdb.cloud
DB_USER=xxxxx
DB_PASSWORD=pscale_pw_xxxxx
DB_NAME=cafeito_db
NODE_ENV=production
\`\`\`

---

## Problemas Comunes

| Problema | Solución |
|----------|----------|
| BD no conecta | Verificar host/usuario/contraseña en .env.local |
| Admin no carga | Limpiar cookies, reintentar login |
| Imágenes no cargan | Usar URLs completas (https://...) |
| npm install falla | Eliminar node_modules y package-lock.json, reinstalar |

---

¡Listo! Tu plataforma CafeITO está funcionando.
