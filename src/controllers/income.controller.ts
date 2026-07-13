import { Hono } from 'hono';
import { IncomeService } from '../services/income.service';

export const incomeController = (incomeService: IncomeService) => {
    const app = new Hono();
    app.get('/', async (c) => {
        const idsQuery = c.req.query('ids');
        if (idsQuery) {
            const ids = idsQuery.split(',');
            const income = await incomeService.byIds(ids.map(Number));
            return c.json(income);
        }
        const income = await incomeService.allIncome();
        return c.json(income);
    });
    app.get('/:id', async (c) => {
        const income = await incomeService.incomeById(Number(c.req.param('id')));
        return c.json(income);
    });

    app.get('/year/:year', async (c) => {
        const year = Number(c.req.param('year'));
        const income = await incomeService.allIncomeByYear(year);
        return c.json(income);
    })
    app.get('till/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const income = await incomeService.allIncomeByYearTillMonth(year, month);
        return c.json(income);
    })
    app.get('monthAndYear/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const income = await incomeService.allIncomeByMonthAndYear(month, year);
        return c.json(income);
    })
    app.get('beforeMonthAndYear/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const income = await incomeService.allIncomeBeforeMonthAndYear(month, year);
        return c.json(income);
    })
    app.get('/groupedByType/:year', async (c) => {
        const year = Number(c.req.param('year'));
        const income = await incomeService.allIncomeByGroupedByType(year);
        return c.json(income);
    })
    app.get('/groupedByType/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const income = await incomeService.allIncomeByMonthAndYearGroupedByType(month, year);
        return c.json(income);
    })
    app.get('monthAndYearNameAndType/:month/:year/:name/:type', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const name = c.req.param('name');
        const type = c.req.param('type');
        const income = await incomeService.allIncomeByMonthAndYearNameAndType(month, year, name, type);
        return c.json(income);
    })
    app.post('/', async (c) => {
        const income = await incomeService.saveIncome(await c.req.json());
        return c.json(income);
    })
    app.delete('/:id', async (c) => {
        const income = await incomeService.deleteIncome(Number(c.req.param('id')));
        return c.json(income);
    })
    return app;
};