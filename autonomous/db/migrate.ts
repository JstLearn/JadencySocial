import Database from 'better-sqlite3';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = join(__dirname, 'jadencysocial.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (_db !== null) return _db;
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    return _db;
}

export function closeDb(): void {
    if (_db !== null) {
        _db.close();
        _db = null;
    }
}

function getSchemaPath(): string {
    return join(__dirname, 'schema.sql');
}

export interface MigrationResult {
    success: boolean;
    applied: string[];
    errors: string[];
}

export function migrate(): MigrationResult {
    const result: MigrationResult = { success: true, applied: [], errors: [] };
    const db = getDb();
    const schemaPath = getSchemaPath();

    if (!existsSync(schemaPath)) {
        result.success = false;
        result.errors.push(`Schema file not found: ${schemaPath}`);
        return result;
    }

    try {
        // Read entire schema
        const schemaSql = readFileSync(schemaPath, 'utf-8');

        // Remove comment lines
        const lines = schemaSql.split('\n').filter(line => !line.trim().startsWith('--'));
        const cleanSql = lines.join('\n');

        // Split by semicolon at the end of statements
        const statements = cleanSql
            .split(/;\s*/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => s + ';');

        // Create _migrations table first if not exists
        db.exec(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Get already applied tables
        const appliedRows = db.prepare('SELECT name FROM _migrations').all() as { name: string }[];
        const applied = new Set(appliedRows.map(r => r.name));

        for (const statement of statements) {
            if (!statement.trim()) continue;

            // Extract table name if this is a CREATE TABLE statement
            const tableMatch = statement.match(/^CREATE TABLE IF NOT EXISTS (\w+)/i);

            if (tableMatch) {
                const tableName = tableMatch[1];

                if (tableName === '_migrations') {
                    // Already created above
                    continue;
                }

                if (applied.has(tableName)) {
                    console.log(`  Skipping ${tableName} (already applied)`);
                    continue;
                }

                try {
                    db.exec(statement);
                    db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(tableName);
                    console.log(`  Applied: ${tableName}`);
                    result.applied.push(tableName);
                } catch (err) {
                    const msg = `Failed to create ${tableName}: ${err}`;
                    console.error(`  ERROR: ${msg}`);
                    result.errors.push(msg);
                }
            } else if (statement.match(/^CREATE INDEX/i)) {
                // Execute index creation (no need to track)
                try {
                    db.exec(statement);
                } catch (err) {
                    // Index might already exist, ignore
                }
            }
            // Ignore other statement types (comments, etc.)
        }

        result.success = result.errors.length === 0;
    } catch (err) {
        result.success = false;
        result.errors.push(`Migration failed: ${err}`);
    }

    return result;
}

export interface RollbackResult {
    success: boolean;
    rolledBack: string[];
    errors: string[];
}

export function rollback(): RollbackResult {
    const result: RollbackResult = { success: true, rolledBack: [], errors: [] };
    const db = getDb();

    const tableNames = ['activity_log', 'call_queue', 'deliveries', 'proposals', 'calls', 'analysis', 'leads'];

    try {
        for (const tableName of tableNames) {
            try {
                const count = (db.prepare(`SELECT COUNT(*) as cnt FROM ${tableName}`).get() as { cnt: number }).cnt;
                if (count > 0) {
                    result.errors.push(`Cannot drop ${tableName}: contains ${count} rows`);
                    continue;
                }
                db.exec(`DROP TABLE IF EXISTS ${tableName}`);
                result.rolledBack.push(tableName);
            } catch (err) {
                result.errors.push(`Failed to drop ${tableName}: ${err}`);
            }
        }
        db.exec('DROP TABLE IF EXISTS _migrations');
    } catch (err) {
        result.success = false;
        result.errors.push(`Rollback failed: ${err}`);
    }

    return result;
}

// CLI
if (process.argv[1]?.endsWith('migrate.ts')) {
    const command = process.argv[2] || 'migrate';

    if (command === 'rollback') {
        const res = rollback();
        console.log('\n=== Rollback Results ===');
        if (res.rolledBack.length > 0) console.log('Rolled back:', res.rolledBack.join(', '));
        if (res.errors.length > 0) console.log('Errors:', res.errors.join('\n'));
        console.log('Success:', res.success);
    } else {
        const res = migrate();
        console.log('\n=== Migration Results ===');
        if (res.applied.length > 0) console.log('Applied:', res.applied.join(', '));
        if (res.errors.length > 0) console.log('Errors:', res.errors.join('\n'));
        console.log('Success:', res.success);
    }

    closeDb();
}
