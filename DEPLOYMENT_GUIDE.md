# Guía de Despliegue - CafeITO POS System

## 1. CONFIGURACIÓN LOCAL

### 1.1 Requisitos Previos
- Node.js 18+ instalado
- MySQL Server instalado y corriendo
- npm o yarn package manager

### 1.2 Instalación Local

\`\`\`bash
# Clonar o descargar el proyecto
cd cafeito-pos

# Instalar dependencias
npm install

# Crear archivo .env.local
\`\`\`

### 1.3 Configurar Base de Datos Local

1. Abre MySQL (línea de comandos o MySQL Workbench)
2. Ejecuta el script de inicialización:

\`\`\`sql
-- Copiar y pegar todo el contenido de: scripts/init-database.sql
\`\`\`

O usa el comando:
\`\`\`bash
mysql -u root -p < scripts/init-database.sql
\`\`\`

### 1.4 Variables de Entorno Locales

Crea el archivo `.env.local` en la raíz del proyecto:

\`\`\`env
# Base de Datos Local
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=cafeito_db

# Next.js
NODE_ENV=development
\`\`\`

### 1.5 Ejecutar Localmente

\`\`\`bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en:
# - Cliente: http://localhost:3000
# - Admin: http://localhost:3000/admin
\`\`\`

### 1.6 Credenciales de Demo

\`\`\`
Email: admin@cafeito.com
Password: admin123
\`\`\`

---

## 2. DESPLIEGUE EN RENDER

### 2.1 Preparar el Proyecto

1. **Asegurar que está en Git:**
\`\`\`bash
git init
git add .
git commit -m "Initial commit: CafeITO POS System"
git push origin main  # o a tu rama principal
\`\`\`

2. **Crear archivo package.json correcto:**
\`\`\`json
{
  "name": "cafeito-pos",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "mysql2": "^3.6.0"
  }
}
\`\`\`

### 2.2 Base de Datos en Render (Opción 1: MySQL Externo Recomendado)

**Usar un servicio MySQL externo como:**
- **Clever Cloud** (gratuito hasta cierto límite)
- **PlanetScale** (MySQL compatible, free tier disponible)
- **AWS RDS** (prueba gratuita)

**O instalar MySQL en Render (menos recomendado):**

1. Ve a https://render.com
2. Crea nueva cuenta o inicia sesión
3. Click en "New" → "Web Service"
4. Selecciona "Docker" como ambiente
5. Usa esta imagen: `mysql:8.0`

### 2.3 Crear Servicio Web en Render

1. **Ir a Render Dashboard:**
   - https://dashboard.render.com

2. **Crear nuevo Web Service:**
   - Click "New" → "Web Service"
   - Conectar repositorio de GitHub (o usar Render Git)
   - Nombre: `cafeito-pos`

3. **Configuración del Servicio:**
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Plan: Free (o pago según necesidad)

4. **Agregar Variables de Entorno:**

   Ve a "Environment" y agrega:
   \`\`\`
   DB_HOST=tu_host_mysql_externo
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=cafeito_db
   NODE_ENV=production
   \`\`\`

### 2.4 Conectar Base de Datos MySQL

**Opción A: PlanetScale (Recomendado - Gratuito)**

1. Ir a https://planetscale.com
2. Crear cuenta gratuita
3. Crear nueva base de datos "cafeito_db"
4. En "Passwords", generar contraseña
5. Copiar connection string:
   \`\`\`
   Host: xxx.us-east-2.psdb.cloud
   User: xxxxx
   Password: pscale_pw_xxxxx
   \`\`\`

6. Ejecutar el script SQL:
   \`\`\`bash
   mysql -u usuario -pcontraseña -h host < scripts/init-database.sql
   \`\`\`

7. En Render, agregar en Environment:
   \`\`\`
   DB_HOST=xxx.us-east-2.psdb.cloud
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=cafeito_db
   \`\`\`

**Opción B: Clever Cloud (Alternativa)**

1. Ir a https://clever-cloud.com
2. Crear base de datos MySQL
3. Copiar credenciales
4. Agregar en Render Environment

### 2.5 Desplegar en Render

1. En Render Dashboard, el servicio debería detectar cambios
2. O hacer push a GitHub:
   \`\`\`bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   \`\`\`

3. Render automáticamente:
   - Detectará cambios
   - Ejecutará `npm install && npm run build`
   - Iniciará el servidor con `npm start`

4. Tu sitio estará en: `https://cafeito-pos.onrender.com`

### 2.6 Verificar Despliegue

Después de desplegarse:

1. Visita: `https://tu-app.onrender.com`
2. Prueba la tienda: `https://tu-app.onrender.com/`
3. Accede a admin: `https://tu-app.onrender.com/admin`
4. Ingresa con demo:
   - Email: `admin@cafeito.com`
   - Password: `admin123`

---

## 3. SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module 'mysql2'"
\`\`\`bash
npm install mysql2
\`\`\`

### Error: "Connection refused" en BD
- Verificar que DB_HOST, DB_USER, DB_PASSWORD son correctos
- Verificar que la BD está corriendo (local)
- Verificar firewall permite conexión (producción)

### Error: "CORS" en cliente
- El backend debe estar sirviendo desde la misma URL
- En desarrollo: http://localhost:3000
- En producción: https://tu-app.onrender.com

### La BD no se inicializa en Render
- Ejecutar manualmente el script SQL con cliente MySQL
- O crear servicio separado que ejecute el script al iniciar

### Imágenes no cargan
- Usar URLs completas (http://ejemplo.com/imagen.jpg)
- Considerar usar Cloudinary o similar para hosting de imágenes

---

## 4. ESTRUCTURA DE CARPETAS

\`\`\`
cafeito-pos/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   └── categories/
│   ├── admin/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── client/
│   ├── admin/
│   └── ui/
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── utils.ts
├── scripts/
│   └── init-database.sql
├── public/
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.mjs
\`\`\`

---

## 5. CAMBIAR CONTRASEÑA ADMIN

Para cambiar la contraseña del administrador en MySQL:

\`\`\`bash
mysql -u root -p

USE cafeito_db;
UPDATE users SET password = '$2b$10$YvI3oSvXW5.WsDUzNL.Z0OB6HfPKL5LjYaQm8BxKKOJWx5mqJ7uS2' 
WHERE email = 'admin@cafeito.com';
\`\`\`

---

## 6. CONTACTO Y SOPORTE

Para problemas o preguntas sobre el despliegue:
- Verifica logs en Render Dashboard
- Consulta documentación oficial de Render
- Revisa documentación de PlanetScale para BD

¡Éxito con tu plataforma CafeITO!
\`\`\`

```json file="" isHidden
