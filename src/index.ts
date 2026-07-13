import { Hono } from 'hono'
import { IncomeRepository } from "./repositories/inome.repository";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { IncomeService } from "./services/income.service";
import { incomeController } from "./controllers/income.controller";
import { OutgoingRepository } from "./repositories/outgoing.repository";
import { OutgoingService } from "./services/outgoing.service";
import { outgoingController } from "./controllers/outgoing.controller";

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);
const incomeRepository = new IncomeRepository(db)
const incomeService = new IncomeService(incomeRepository)
const outgoingRepository = new OutgoingRepository(db)
const outgoingService = new OutgoingService(outgoingRepository)

const app = new Hono()
app.route('/income', incomeController(incomeService));
app.route('/outgoing', outgoingController(outgoingService));

export default app
