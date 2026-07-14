export interface CalendarEvent {
    id: number;
    date: string;
    event: string;
    isCompleteDay: boolean;
    isBirthday: boolean;
    isVacation: boolean;
    importId: number | null;
}
