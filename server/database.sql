-- Creacion de la base de datos con soporte para caracteres especiales
CREATE DATABASE IF NOT EXISTS el_topo_porteno CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE el_topo_porteno;

-- Tabla de administradores del sistema
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para consultas entrantes del cotizador o webhooks
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    servicio ENUM('Excavacion', 'Sanjeo', 'Limpieza') NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('Nuevo', 'Contactado', 'Cerrado exitoso', 'Cerrado no concretado') NOT NULL DEFAULT 'Nuevo',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para registros confirmados
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fecha_alta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cliente_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE RESTRICT
);

-- Tabla para el seguimiento operativo
CREATE TABLE trabajos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    tipo_servicio ENUM('Excavacion', 'Sanjeo', 'Limpieza') NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    profundidad_estimada DECIMAL(6,2) NULL,
    estado ENUM('Presupuestado', 'Aceptado', 'En ejecucion', 'Finalizado', 'En garantia', 'Cerrado') NOT NULL DEFAULT 'Presupuestado',
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    observaciones TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trabajo_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
);

-- Tabla para auditoria de estados
CREATE TABLE historial_trabajos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado_anterior ENUM('Presupuestado', 'Aceptado', 'En ejecucion', 'Finalizado', 'En garantia', 'Cerrado') NOT NULL,
    estado_nuevo ENUM('Presupuestado', 'Aceptado', 'En ejecucion', 'Finalizado', 'En garantia', 'Cerrado') NOT NULL,
    comentario TEXT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_trabajo FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);