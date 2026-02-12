const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'recipes.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    mood TEXT NOT NULL
  )
`);

module.exports = db;
