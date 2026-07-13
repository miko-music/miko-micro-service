export interface IncomeBase {
    id: number | null;
    serverId: number | null;
    name: string;
    date: string;
    updatedAt: string;
    description: string;
    category: string;
    type: string;
}
export interface Income extends IncomeBase {
    amount: number;
}