import { Hono } from "hono";
import { OutgoingService } from "../services/outgoing.service";

export const outgoingController = (outgoingService: OutgoingService) => {
    const app = new Hono();
    app.get('/', async (c) => {
        const idsQuery = c.req.query('ids');
        if (idsQuery) {
            const ids = idsQuery.split(',');
            const outgoing = await outgoingService.byIds(ids.map(Number));
            return c.json(outgoing);
        }
        const outgoing = await outgoingService.allOutgoing();
        return c.json(outgoing);
    });
    app.get('/:id', async (c) => {
        const outgoing = await outgoingService.outgoingById(Number(c.req.param('id')));
        return c.json(outgoing);
    });

    app.get('/year/:year', async (c) => {
        const year = Number(c.req.param('year'));
        const outgoing = await outgoingService.allOutgoingByYear(year);
        return c.json(outgoing);
    })
    app.get('till/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const outgoing = await outgoingService.allOutgoingByYearTillMonth(year, month);
        return c.json(outgoing);
    })
    app.get('monthAndYear/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const outgoing = await outgoingService.allOutgoingByMonthAndYear(month, year);
        return c.json(outgoing);
    })
    app.get('beforeMonthAndYear/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const outgoing = await outgoingService.allOutgoingBeforeMonthAndYear(month, year);
        return c.json(outgoing);
    })
    app.get('/groupedByType/:year', async (c) => {
        const year = Number(c.req.param('year'));
        const outgoing = await outgoingService.allOutgoingByGroupedByType(year);
        return c.json(outgoing);
    })
    app.get('/groupedByType/:month/:year', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const outgoing = await outgoingService.allOutgoingByMonthAndYearGroupedByType(month, year);
        return c.json(outgoing);
    })
    app.get('monthAndYearNameAndType/:month/:year/:name/:type', async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const name = c.req.param('name');
        const type = c.req.param('type');
        const outgoing = await outgoingService.allOutgoingByMonthAndYearNameAndType(month, year, name, type);
        return c.json(outgoing);
    })
    app.post('/', async (c) => {
        const outgoing = await outgoingService.saveOutgoing(await c.req.json());
        return c.json(outgoing);
    })
    app.delete('/:id', async (c) => {
        const outgoing = await outgoingService.deleteOutgoing(Number(c.req.param('id')));
        return c.json(outgoing);
    })
    return app;
};