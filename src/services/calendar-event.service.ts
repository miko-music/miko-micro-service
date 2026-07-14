import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { CalendarEventRepository } from "../repositories/calendar-event.repository";

export class CalendarEventService {
    constructor(private calendarEventRepository: CalendarEventRepository) { }
    async calendarEventById(id: number): Promise<CalendarEvent | null> {
        const data = await this.calendarEventRepository.calendarEventById(id);
        return data;
    }
    async allCalendarEvents(): Promise<CalendarEvent[]> {
        return await this.calendarEventRepository.allCalendarEvents();
    }
    async allBirthdays(): Promise<CalendarEvent[]> {
        return await this.calendarEventRepository.allBirthdays();
    }
    async allVacations(): Promise<CalendarEvent[]> {
        return await this.calendarEventRepository.allVacations();
    }
    async allEventsByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        return this.calendarEventRepository.allEventsByMonthAndYear(month, year);
    }
    async allVacationsByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        return this.calendarEventRepository.allVacationsByMonthAndYear(month, year);
    }
    async allBirthdaysByMonthAndYear(
        month: number,
        year: number,
    ): Promise<CalendarEvent[]> {
        return this.calendarEventRepository.allBirthdaysByMonthAndYear(month, year);
    }
    async searchEvents(event: string, onlyBirthday: boolean): Promise<CalendarEvent[]> {
        return this.calendarEventRepository.searchEvents(event, onlyBirthday);
    }
    async saveCalendarEvent({
        id,
        date,
        event,
        isCompleteDay,
    }: {
        id: number | null,
        date: string,
        event: string,
        isCompleteDay: boolean,
    }): Promise<void> {
        await this.calendarEventRepository.saveCalendarEvent(id, date, event, isCompleteDay);
    }
    async saveBirthday({
        id,
        date,
        event
    }: {
        id: number | null,
        date: string,
        event: string,
    }): Promise<void> {
        await this.calendarEventRepository.saveBirthday(id, date, event);
    }
    async saveVacation({
        id,
        date,
        event,
        isCompleteDay,
    }: {
        id: number | null,
        date: string,
        event: string,
        isCompleteDay: boolean,
    }): Promise<void> {
        await this.calendarEventRepository.saveVacation(id, date, event, isCompleteDay);
    }
    async deleteEvents(ids: number[]): Promise<void> {
        this.calendarEventRepository.deleteEvents(ids);
    }
    async deleteEvent(id: number): Promise<void> {
        await this.calendarEventRepository.deleteEvent(id);
    }
}
