import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { eq, inArray, like, and, gte, lte, sum } from 'drizzle-orm';
import dayjs from 'dayjs';
import { from } from "linq-to-typescript";
import { HouseHoldStatistic } from "../interfaces/house-hold-statistic.interface";
import { calendarEvent } from "../db/schema";

export class CalendarEventRepository {
    constructor(private db: BetterSQLite3Database) { }
    private mapCalendarEvent(event: {
        id: number,
        date: string,
        event: string,
        isCompleteDay: boolean,
        isBirthday: boolean,
        isVacation: boolean,
        importId: number | null
    }): CalendarEvent | null {
        return {
            date: event.date,
            event: event.event,
            isCompleteDay: event.isCompleteDay,
            isBirthday: event.isBirthday,
            isVacation: event.isVacation,
            importId: event.importId,
            id: event.id,
        };
    }
    private mapCalendarEvents(events: {
        id: number,
        date: string,
        event: string,
        isCompleteDay: boolean,
        isBirthday: boolean,
        isVacation: boolean,
        importId: number | null
    }[]) {
        return events.map((event) => {
            return {
                date: event.date,
                event: event.event,
                isCompleteDay: event.isCompleteDay,
                isBirthday: event.isBirthday,
                isVacation: event.isVacation,
                importId: event.importId,
                id: event.id,
            };
        });
    }
    async calendarEventById(id: number): Promise<CalendarEvent | null> {
        const data = await this.db.select().from(calendarEvent).where(
            eq(calendarEvent.id, id)
        ).execute();
        return this.mapCalendarEvent(data[0]);
    }
    async allCalendarEvents(): Promise<CalendarEvent[]> {
        const data = await this.db.select().from(calendarEvent).where(
            and(
                eq(calendarEvent.isBirthday, false),
                eq(calendarEvent.isVacation, false)
            )
        ).execute();
        return this.mapCalendarEvents(data);
    }
    async allBirthdays(): Promise<CalendarEvent[]> {
        const data = await this.db.select().from(calendarEvent).where(
            eq(calendarEvent.isBirthday, true)
        ).execute();
        return this.mapCalendarEvents(data);
    }
    async allVacations(): Promise<CalendarEvent[]> {
        const data = await this.db.select().from(calendarEvent).where(
            eq(calendarEvent.isVacation, true)
        ).execute();
        return this.mapCalendarEvents(data);
    }

    async allEventsByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        const startDate = dayjs().year(year).month(month).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');
        const data = await this.db.select()
            .from(calendarEvent)
            .where(
                and(
                    gte(calendarEvent.date, startDate),
                    lte(calendarEvent.date, endDate),
                    eq(calendarEvent.isBirthday, false),
                    eq(calendarEvent.isVacation, false)
                )
            )
            .execute();
        return this.mapCalendarEvents(data);
    }
    async allVacationsByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        const startDate = dayjs().year(year).month(month).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');
        const data = await this.db.select()
            .from(calendarEvent)
            .where(
                and(
                    gte(calendarEvent.date, startDate),
                    lte(calendarEvent.date, endDate),
                    eq(calendarEvent.isVacation, true)
                )
            )
            .execute();
        return this.mapCalendarEvents(data);
    }
    async allBirthdaysByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        const startDate = dayjs().year(year).month(month).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');
        const data = await this.db.select()
            .from(calendarEvent)
            .where(
                and(
                    gte(calendarEvent.date, startDate),
                    lte(calendarEvent.date, endDate),
                    eq(calendarEvent.isBirthday, true)
                )
            )
            .execute();
        return this.mapCalendarEvents(data);
    }
    async searchEvents(event: string, onlyBirthday: boolean): Promise<CalendarEvent[]> {
        const events = await this.allCalendarEvents();
        return from(events)
            .where((e) => e.event.toLowerCase().indexOf(event.toLowerCase()) != -1 && (onlyBirthday ? e.isBirthday : true))
            .toArray();
    }
    private async save(
        id: number | null,
        date: string,
        event: string,
        isCompleteDay: boolean,
        isBirthday: boolean,
        isVacation: boolean
    ): Promise<void> {
        const formatedDate = dayjs(date).format('YYYY-MM-DD');
        if (id) {
            await this.db.update(calendarEvent).set({
                date: formatedDate,
                event,
                isCompleteDay,
                isBirthday,
                isVacation
            }).where(eq(calendarEvent.id, id)).execute();
        } else {
            await this.db.insert(calendarEvent).values({
                date: formatedDate,
                event,
                isCompleteDay,
                isBirthday,
                isVacation
            }).execute();
        }
    }
    async saveCalendarEvent({
        id,
        date,
        event,
        isCompleteDay
    }: {
        id: number | null,
        date: string,
        event: string,
        isCompleteDay: boolean
    }): Promise<void> {
        await this.save(id, date, event, isCompleteDay, false, false);
    }
    async saveBirthday({
        id,
        date,
        event
    }: {
        id: number | null,
        date: string,
        event: string
    }): Promise<void> {
        await this.save(id, date, event, true, true, false);
    }
    async saveVacation({
        id,
        date,
        event,
        isCompleteDay
    }: {
        id: number | null,
        date: string,
        event: string,
        isCompleteDay: boolean
    }): Promise<void> {
        await this.save(id, date, event, isCompleteDay, false, true);
    }
    async deleteEvents(ids: number[]): Promise<void> {
        if (ids.length == 0) {
            return;
        }
        ids.forEach((id) => {
            (async () => {
                await this.deleteEvent(id);
            })();
        });

    }
    async deleteEvent(id: number): Promise<void> {
        await this.db.delete(calendarEvent).where(eq(calendarEvent.id, id)).execute();
    }
}
