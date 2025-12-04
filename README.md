# CafeITO - Plataforma de Punto de Venta para Cafetería

Una plataforma moderna de punto de venta (POS) diseñada específicamente para cafeterías, con interfaz de cliente para hacer pedidos y panel de administración para gestionar productos y órdenes.

## Características

### Para Clientes
- Catálogo de productos organizado por categorías
- Café, pan, pastelerías y productos para llevar
- Carrito de compras intuitivo
- Sistema de checkout con información de contacto
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- Notas especiales para pedidos personalizados

### Para Administradores
- Panel de control seguro con autenticación
- CRUD completo de productos
- Gestión de inventario
- Visualización de órdenes en tiempo real
- Cambio de estado de órdenes (pendiente, preparando, listo, completado)
- Diseño responsivo y profesional

## Estructura del Proyecto

\`\`\`
cafeito-pos/
├── app/
│   ├── api/                 # Rutas API REST
│   │   ├── auth/           # Autenticación
│   │   ├── products/       # CRUD productos
│   │   ├── orders/         # CRUD órdenes
│   │   └── categories/     # Categorías
│   ├── admin/              # Panel de administrador
│   ├── page.tsx            # Interfaz de cliente
│   ├── layout.tsx          # Layout principal
│   └── globals.css         # Estilos tema CafeITO
├── components/
│   ├── client/             # Componentes de cliente
│   ├── admin/              # Componentes de admin
│   └── ui/                 # Componentes reutilizables
├── lib/
│   ├── db.ts              # Conexión MySQL
│   ├── auth.ts            # Funciones autenticación
│   └── utils.ts           # Utilidades
├── scripts/
│   └── init-database.sql  # Script de BD
├── public/                # Archivos estáticos
└── DEPLOYMENT_GUIDE.md    # Guía de despliegue
\`\`\`

## Inicio Rápido

### 1. Clonar el Proyecto
\`\`\`bash
git clone https://github.com/tu-usuario/cafeito-pos.git
cd cafeito-pos
\`\`\`

### 2. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configurar Base de Datos

#### Opción A: Usando MySQL local
\`\`\`bash
# Ejecutar script SQL
mysql -u root -p < scripts/init-database.sql

# O copiar y ejecutar manualmente en MySQL
\`\`\`

#### Opción B: Usando PlanetScale (Recomendado para Render)
1. Crear cuenta en https://planetscale.com
2. Crear base de datos "cafeito_db"
3. Generar credenciales y conexión

### 4. Crear archivo .env.local
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Editar `.env.local` con tus credenciales:
\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=cafeito_db
\`\`\`

### 5. Ejecutar Localmente
\`\`\`bash
npm run dev
\`\`\`

Acceder a:
- **Cliente**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

### 6. Credenciales de Demo
\`\`\`
Email: admin@cafeito.com
Password: admin123
\`\`\`

## Despliegue en Render

Consulta `DEPLOYMENT_GUIDE.md` para instrucciones completas sobre:
- Configuración de Render
- Setup de base de datos MySQL externo (PlanetScale)
- Variables de entorno en producción
- Troubleshooting

## Colores del Tema

**CafeITO** utiliza una paleta de colores cálida y profesional:
- **Café (Principal)**: #6d4c41
- **Verde (Secundario)**: #4a7c59
- **Gris (Neutral)**: #7d6b5d
- **Crema (Fondo)**: #faf8f5

## Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Node.js, Next.js API Routes
- **Base de Datos**: MySQL 8
- **Autenticación**: JWT con cookies httpOnly
- **UI Components**: shadcn/ui, Radix UI

## Scripts Disponibles

\`\`\`bash
npm run dev      # Iniciar servidor desarrollo
npm run build    # Compilar para producción
npm start        # Iniciar servidor producción
npm run lint     # Ejecutar linter
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de administrador
- `GET /api/auth/check` - Verificar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear producto (admin)
- `GET /api/products/[id]` - Obtener producto específico
- `PUT /api/products/[id]` - Actualizar producto (admin)
- `DELETE /api/products/[id]` - Eliminar producto (admin)

### Órdenes
- `GET /api/orders` - Obtener órdenes (admin)
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders/[id]` - Obtener detalles de orden (admin)
- `PUT /api/orders/[id]` - Actualizar estado (admin)

### Categorías
- `GET /api/categories` - Obtener categorías

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de MySQL | localhost / xxx.psdb.cloud |
| `DB_USER` | Usuario MySQL | root |
| `DB_PASSWORD` | Contraseña MySQL | tu_password |
| `DB_NAME` | Nombre BD | cafeito_db |
| `NODE_ENV` | Entorno | development / production |

## Seguridad

- Contraseñas hasheadas con PBKDF2
- Cookies httpOnly para tokens de sesión
- Validación de autenticación en rutas de admin
- Protección contra inyección SQL con prepared statements

## Resolución de Problemas

### Error: Cannot find module 'mysql2'
\`\`\`bash
npm install mysql2
\`\`\`

### Error: Connection refused en BD local
- Verificar que MySQL está corriendo
- Verificar credenciales en `.env.local`
- Asegurar que la BD "cafeito_db" existe

### Error: 404 en /admin
- Asegurar que cookies están habilitadas
- Verificar que estás logueado correctamente
- Limpiar cookies del navegador y reintentar

## Mejoras Futuras

- [ ] Integración con Stripe/PayPal para pagos online
- [ ] Sistema de reportes y analytics
- [ ] Gestión de múltiples sucursales
- [ ] App móvil para iOS/Android
- [ ] Sistema de promociones y descuentos
- [ ] Integración con proveedores para reorden
- [ ] Historial de inventario detallado
- [ ] Sistema de recibos imprimibles

## Licencia

MIT - Libre para uso personal y comercial

## Contacto

Para preguntas o sugerencias sobre CafeITO, consulta la documentación o crea un issue en el repositorio.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenedor**: Tu Nombre
