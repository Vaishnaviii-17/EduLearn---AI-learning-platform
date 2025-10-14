-- Active: 1759504273081@@127.0.0.1@3306
CREATE DATABASE learning_ai;

USE learning_ai;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT
);

CREATE TABLE code_snippets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code TEXT,
    explanation TEXT
);
