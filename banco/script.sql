-- Create the database
CREATE DATABASE restaurante;

-- Use the database
USE restaurante;

-- Tabela de Usuários
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL, -- Senha armazenada de forma segura
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Mesas
CREATE TABLE mesa (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status_entrega IN ('livre', 'ocupada')),
);

-- Tabela de Comandas
CREATE TABLE comanda (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL REFERENCES mesa (id),
    usuario_id INTEGER REFERENCES usuario (id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('aberta', 'fechada')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechado_em TIMESTAMP
);

-- Tabela de Itens do Cardápio
CREATE TABLE item_cardapio (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('prato', 'bebida')),
    preco NUMERIC(10, 2) NOT NULL
);

-- Tabela de Ordens de Produção
CREATE TABLE ordem_producao (
    id SERIAL PRIMARY KEY,
    comanda_id INTEGER NOT NULL REFERENCES comanda (id),
    item_cardapio_id INTEGER NOT NULL REFERENCES item_cardapio (id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    setor VARCHAR(10) NOT NULL CHECK (setor IN ('cozinha', 'copa')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'em_producao', 'pronto', 'entregue')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
