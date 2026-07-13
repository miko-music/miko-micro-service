import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { eq, inArray, like, and, gte, lte, sum } from 'drizzle-orm';
import dayjs from 'dayjs';
import { from } from "linq-to-typescript";
import { HouseHoldStatistic } from "../interfaces/house-hold-statistic.interface";
import { calendarEvent } from "../db/schema";

export class CalendarEventRepository {
    constructor(private db: BetterSQLite3Database) { }
    async allCalendarEvents(): Promise<CalendarEvent[]> {
        return await this.db.select().from(calendarEvent).execute();
    }
    async allByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        const events = await this.getAll(STORE_NAME);

        if (events) {
            return from(events)
                .where((e) => (!e.isBirthday && (moment(e.date).month() == month && moment(e.date).year() == year)) || (e.isBirthday && moment(e.date).month() == month))
                .toArray();
        }
        return events;
    }
    async allByDayMonthAndYear(
        day: number,
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        const events = await this.getAll(STORE_NAME);

        if (events) {
            return from(events)
                .where((e) => (!e.isBirthday && (moment(e.date).date() == day && moment(e.date).month() == month && moment(e.date).year() == year)) || (e.isBirthday && moment(e.date).month() == month))
                .toArray();
        }
        return events;
    }
    async searchEvents(event: string, onlyBirthday: boolean): Promise<CalendarEvent[]> {
        const events = await this.getAll(STORE_NAME);
        if (events) {
            return from(events)
                .where((e) => e.event.toLowerCase().indexOf(event.toLowerCase()) != -1 && (onlyBirthday ? e.isBirthday : true))
                .toArray();
        }
        return events;
    }
    async saveCalendarEvent(
        calendarEvent: CalendarEvent,
    ): Promise<CalendarEvent | null> {
        const { date, event, isCompleteDay, isBirthday, id } =
            calendarEvent;

        if (calendarEvent.id) {
            await this.update(STORE_NAME, {
                id,
                date,
                event,
                isCompleteDay,
                isBirthday,
            });
            return await this.byId(STORE_NAME, calendarEvent.id);
        }
        await this.save(STORE_NAME, {
            date,
            event,
            isCompleteDay,
            isBirthday,
        });
        const events = await this.getAll(STORE_NAME);
        if (events) {
            return events[events.length - 1];
        }
        return null;
    }
    async deleteEvents(ids: number[]): Promise<void> {
        if (ids.length == 0) {
            return;
        }
        ids.forEach((id) => {
            (async () => {
                await this.delete(STORE_NAME, id);
            })();
        });

    }
    async calendarEventById(id: number): Promise<CalendarEvent | null> {
        return await this.byId(STORE_NAME, id);
    }
}
