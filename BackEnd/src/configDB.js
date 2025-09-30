import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.db');

export async function openDb () {
  console.log("CONECTANDO AO BANCO DE DADOS EM:", dbPath);
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  })
}