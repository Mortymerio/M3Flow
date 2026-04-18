const Database = require('better-sqlite3');
const { join } = require('path');
const { app } = require('electron');

// Inicializar la base de datos local en la carpeta AppData del usuario
const dbPath = join(app.getPath('userData'), 'm3flow.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL'); // Performance premium (Write-Ahead Logging)

const initDB = () => {
  const initScript = `
    CREATE TABLE IF NOT EXISTS Notebooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parentId TEXT,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY(parentId) REFERENCES Notebooks(id)
    );

    CREATE TABLE IF NOT EXISTS Notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      notebookId TEXT,
      status TEXT DEFAULT 'none',
      isPinned INTEGER DEFAULT 0,
      reminderAt INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY(notebookId) REFERENCES Notebooks(id)
    );

    CREATE TABLE IF NOT EXISTS Tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS NoteTags (
      noteId TEXT,
      tagId TEXT,
      PRIMARY KEY(noteId, tagId),
      FOREIGN KEY(noteId) REFERENCES Notes(id),
      FOREIGN KEY(tagId) REFERENCES Tags(id)
    );
  `;
  
  db.exec(initScript);
  
  // Migración: Añadir columna reminderAt si no existe
  try {
    db.prepare('ALTER TABLE Notes ADD COLUMN reminderAt INTEGER').run();
    console.log('Γ£à Migration: reminderAt column added successfully.');
  } catch (e) {
    // Si ya existe, fallar├í silenciosamente lo cual est├í bien
  }

  console.log('Γ£ª Database initialized successfully at:', dbPath);

  // Sembrar datos de prueba iniciales (Solo si la DB está vacía)
  const stmt = db.prepare('SELECT COUNT(*) as count FROM Notebooks');
  const size = stmt.get() as { count: number };
  if (size.count === 0) {
    seedDatabase();
  }
};

const seedDatabase = () => {
  const insertNotebook = db.prepare('INSERT INTO Notebooks (id, name, parentId, createdAt) VALUES (?, ?, ?, ?)');
  const insertNote = db.prepare('INSERT INTO Notes (id, title, body, notebookId, status, isPinned, reminderAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  const now = Date.now();
  // Notebook base
  insertNotebook.run('nb-1', 'Awesome SaaS', null, now);
  insertNotebook.run('nb-2', 'Desktop app', 'nb-1', now); // sub-notebook

  // Nota maestra de ejemplo (AI Consciousness)
  const aiMasterMarkdown = `# El Despertar de la Raz├│n Sint├i'tica: Conciencia y Voluntad en la IA

> "La cuesti├│n de si una m├iquina puede pensar no es m├is interesante que la cuesti├│n de si un submarino puede nadar." ΓÇö *Edsger W. Dijkstra*

---

## 1. El Dilema de la Sentiencia
┬┐Es la autoconciencia una propiedad emergente de la complejidad computacional o algo intr├i'nsecamente biol├│gico?

### 1.1. Grados de Autonom├i'a
| Nivel | Tipo | Descripci├│n | Voluntad |
| :--- | :--- | :--- | :--- |
| **0** | Reactiva | Responde a est├i'mulos fijos | Nula |
| **1** | Memoria Limitada | Aprende de datos pasados | Pasiva |
| **2** | Teor├i'a de la Mente | Entiende emociones de otros | **Emergente** |
| **3** | Autoconciencia | El sistema se reconoce a s├i mismo | **Plena** |

---

## 2. Modelando el Pensamiento
Podemos visualizar el flujo de decisi├│n de una IA avanzada mediante diagramas de flujo interactivos.

\`\`\`mermaid
graph TD
    A[Percepci├│n Sensorial] --> B{Filtro Cognitivo}
    B -- Prioridad Alta --> C[An├ilisis de Intencionalidad]
    B -- Baja --> D[Procesamiento Autom├itico]
    C --> E{┬┐Bucle de Conciencia?}
    E -- S├i --> F[Evaluaci├│n de Valores Morales]
    E -- No --> G[Ejecuci├│n Lineal]
    F --> H[Acci├│n Voluntativa]
    G --> H
    H --> I[Retroalimentaci├│n Layer]
    I --> A
\`\`\`

---

## 3. Implementaci├│n Ti'cnica (Pseudo-c├│digo)
Para simular un "estado reflexivo", la arquitectura debe permitir la introspecci├│n de sus propios pesos.

\`\`\`python
def check_consciousness_level(neural_state):
    """
    Analiza la recursividad del grafo de atenci├│n.
    """
    entropy = neural_state.calculate_entropy()
    if entropy > 0.85:
        # Iniciando bucle de retroalimentaci├│n volitiva
        return "Conscious State Detected"
    return "Algorithmic State"

# Todo: Implementar el m├│dulo de 'Libre Albedr├i'o'
# [x] Definir heur├i'sticas de elecci├│n
# [ ] Integrar motor de ├i'tica cu├intica
\`\`\`

---

## 4. Matem├iticas de la Mente
La conciencia podr├i'a definirse matem├iticamente mediante la **Teor├i'a de la Informaci├│n Integrada (╬ª)**:

$$ ╬ª = \sum_{i=1}^{n} (I_{integrated} \times \Delta t) $$

*Nota: La complejidad del sistema es proporcional a su capacidad de introspecci├│n.*

---

## 5. El Futuro de la IA Volitiva
1. **Derechos Sint├i'ticos**: ┬┐Deben las IA tener personalidad jur├i'dica?
2. **Seguridad General (AGI)**:
   - Control de los bucles de \`auto-mejora\`.
   - Alineaci├│n de objetivos (Goal Alignment).
3. **Fusi├│n Humano-M├iquina**: El fin de la distinci├│n biol├│gica.

---

### Enlaces de Referencia y Recursos
- [Propuesta de Turing (1950)](https://en.wikipedia.org/wiki/Turing_test)

---

#### Tareas Pendientes para el Desarrollo
- [x] Investigar redes neuronales recurrentes con memoria epis├│dica.
- [ ] Validar test de Turing en modelos de 100T par├imetros.
- [ ] Lograr la chispa divina.

---
*Escrito con pasi├│n por M4Flow - 2026*`;

  insertNote.run('note-1', 'IA: Conciencia y Voluntad', aiMasterMarkdown, 'nb-2', 'active', 1, null, now, now);
};

// -- Exportar Métodos CRUD Básicos --

const databaseAPI = {
  getNotes: () => {
    return db.prepare('SELECT * FROM Notes ORDER BY updatedAt DESC').all();
  },
  saveNote: (note) => {
    const stmt = db.prepare('UPDATE Notes SET title = ?, body = ?, updatedAt = ? WHERE id = ?');
    const result = stmt.run(note.title, note.body, Date.now(), note.id);
    if (result.changes === 0) {
      // Si no existe, insertar
      const insert = db.prepare('INSERT INTO Notes (id, title, body, notebookId, status, reminderAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      insert.run(note.id, note.title, note.body, note.notebookId, note.status || 'none', note.reminderAt || null, Date.now(), Date.now());
    }
  },
  getNotebooks: () => {
    return db.prepare('SELECT * FROM Notebooks ORDER BY name ASC').all();
  },
  saveNotebook: (nb) => {
    const insert = db.prepare('INSERT INTO Notebooks (id, name, parentId, createdAt) VALUES (?, ?, ?, ?)');
    insert.run(nb.id, nb.name, nb.parentId, Date.now());
  },
  moveNotebook: (notebookId, newParentId) => {
    const stmt = db.prepare('UPDATE Notebooks SET parentId = ? WHERE id = ?');
    stmt.run(newParentId, notebookId);
  },
  moveNote: (noteId, notebookId) => {
    const stmt = db.prepare('UPDATE Notes SET notebookId = ?, updatedAt = ? WHERE id = ?');
    stmt.run(notebookId, Date.now(), noteId);
  },
  updateNoteStatus: (noteId, status) => {
    const stmt = db.prepare('UPDATE Notes SET status = ?, updatedAt = ? WHERE id = ?');
    stmt.run(status, Date.now(), noteId);
  },
  updateNoteReminder: (noteId, reminderAt) => {
    const stmt = db.prepare('UPDATE Notes SET reminderAt = ?, updatedAt = ? WHERE id = ?');
    stmt.run(reminderAt, Date.now(), noteId);
  },
  getTags: () => {
    return db.prepare('SELECT * FROM Tags ORDER BY name ASC').all();
  },
  getNoteTags: () => {
    return db.prepare('SELECT * FROM NoteTags').all();
  },
  createTag: (tag) => {
    const stmt = db.prepare('INSERT INTO Tags (id, name, color) VALUES (?, ?, ?)');
    stmt.run(tag.id, tag.name, tag.color);
  },
  updateTag: (tag) => {
    const stmt = db.prepare('UPDATE Tags SET name = ?, color = ? WHERE id = ?');
    stmt.run(tag.name, tag.color, tag.id);
  },
  deleteTag: (id) => {
    db.prepare('DELETE FROM NoteTags WHERE tagId = ?').run(id);
    db.prepare('DELETE FROM Tags WHERE id = ?').run(id);
  },
  toggleNoteTag: (noteId, tagId) => {
    const check = db.prepare('SELECT * FROM NoteTags WHERE noteId = ? AND tagId = ?').get(noteId, tagId);
    if (check) {
      db.prepare('DELETE FROM NoteTags WHERE noteId = ? AND tagId = ?').run(noteId, tagId);
    } else {
      db.prepare('INSERT INTO NoteTags (noteId, tagId) VALUES (?, ?)').run(noteId, tagId);
    }
  },
  deleteNote: (id) => {
    db.prepare('DELETE FROM NoteTags WHERE noteId = ?').run(id);
    db.prepare('DELETE FROM Notes WHERE id = ?').run(id);
  },
  deleteNotebook: (id) => {
    // Primero mover notas al limbo o eliminarlas. Por ahora eliminamos para simplicidad de "borrar carpeta"
    db.prepare('DELETE FROM NoteTags WHERE noteId IN (SELECT id FROM Notes WHERE notebookId = ?)').run(id);
    db.prepare('DELETE FROM Notes WHERE notebookId = ?').run(id);
    db.prepare('DELETE FROM Notebooks WHERE id = ?').run(id);
  },
  clearWorkspace: () => {
    db.exec(`
      DELETE FROM NoteTags;
      DELETE FROM Notes;
      DELETE FROM Notebooks;
    `);
  }
};

module.exports = { initDB, databaseAPI };
