import { CalendarEventService } from "../services/calendar-event.service";
import { Hono } from 'hono';

export const calendarEventController = (calendarEventService: CalendarEventService) => {
    const app = new Hono();
    app.get("/", async (c) => {
        const events = await calendarEventService.allCalendarEvents();
        return c.json(events);
    });
    app.get("/birthdays", async (c) => {
        const events = await calendarEventService.allBirthdays();
        return c.json(events);
    });
    app.get("/vacations", async (c) => {
        const events = await calendarEventService.allVacations();
        return c.json(events);
    });
    app.get("/events/:month/:year", async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const events = await calendarEventService.allEventsByMonthAndYear(month, year);
        return c.json(events);
    });
    app.get("/birthdays/:month/:year", async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const events = await calendarEventService.allBirthdaysByMonthAndYear(month, year);
        return c.json(events);
    });
    app.get("/vacations/:month/:year", async (c) => {
        const month = Number(c.req.param('month'));
        const year = Number(c.req.param('year'));
        const events = await calendarEventService.allVacationsByMonthAndYear(month, year);
        return c.json(events);
    });
    app.get("/:id", async (c) => {
        const event = await calendarEventService.calendarEventById(Number(c.req.param('id')));
        return c.json(event);
    });
    app.post("/calendar-events", async (c) => {
        const event = await calendarEventService.saveCalendarEvent(await c.req.json());
        return c.json(event);
    });
    app.delete("/calendar-events/:id", async (c) => {
        await calendarEventService.deleteEvent(Number(c.req.param('id')));
    });
    app.delete("/calendar-events", async (c) => {
        const idsQuery = c.req.query('ids');
        if (idsQuery) {
            const ids = idsQuery.split(',');
            await calendarEventService.deleteEvents(ids.map(Number));
        }
    });
    return app;
}