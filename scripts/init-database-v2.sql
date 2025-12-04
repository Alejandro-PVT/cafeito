-- CafeITO - Point of Sale System (Versión 2)
-- MySQL Database Schema - Actualizado

CREATE DATABASE IF NOT EXISTS cafeito_db;
USE cafeito_db;

-- Table: Users (Administradores)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Categories (Categorías de productos)
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Products (Productos)
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Table: Orders (Órdenes/Pedidos)
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  payment_method ENUM('cash', 'card', 'transfer') DEFAULT 'cash',
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Order Items (Detalles de cada orden)
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table: Inventory Logs
CREATE TABLE inventory_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  quantity_change INT NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id);

-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Café', 'Bebidas de café especiales'),
('Pan', 'Pan y pastelería fresca'),
('Productos', 'Artículos para llevar');

-- Insertar productos
INSERT INTO products (name, description, category_id, price, stock) VALUES
('Espresso', 'Café espresso clásico', 1, 2.50, 50),
('Capuchino', 'Capuchino cremoso con espuma', 1, 3.50, 40),
('Café Americano', 'Café americano suave', 1, 3.00, 45),
('Latte', 'Café latte con leche vaporizada', 1, 4.00, 35),
('Macchiato', 'Espresso con espuma de leche', 1, 3.75, 30),
('Pan de Chocolate', 'Pan dulce con chocolate', 2, 2.00, 30),
('Croissant', 'Croissant francés fresco', 2, 3.00, 25),
('Café en Grano (500g)', 'Café premium en grano', 3, 12.00, 20),
('Café Molido (250g)', 'Café molido para cafetera', 3, 8.00, 25),
('Taza de Cerámica', 'Taza de cerámica con logo CafeITO', 3, 10.00, 15);

-- Crear usuario admin (contraseña: admin123 - CAMBIA ESTO)
INSERT INTO users (username, password, name, role) VALUES
('admin', '$2b$10$YvI3oSvXW5.WsDUzNL.Z0OB6HfPKL5LjYaQm8BxKKOJWx5mqJ7uS2', 'Administrador CafeITO', 'admin');
