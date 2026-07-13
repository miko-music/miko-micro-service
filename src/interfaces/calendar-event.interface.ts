export interface CalendarEvent {
    id: number | null;
    date: string;
    event: string;
    isCompleteDay: boolean;
    isBirthday: boolean;
    isVacation?: boolean;
    importId?: string;
}