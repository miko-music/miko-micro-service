import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { income } from '../db/schema';
import { eq, inArray, like, and, gte, lte, sum } from 'drizzle-orm';
import type { Income } from '../interfaces/income.interface';
import dayjs from 'dayjs';
import { from } from "linq-to-typescript";
import { HouseHoldStatistic } from '../interfaces/house-hold-statistic.interface';

export class IncomeRepository {
    constructor(private db: BetterSQLite3Database) { }
    private mapIncome(row: { id: number, serverId: number | null, name: string, amount: number, date: string, description: string, updatedAt: string, category: string, type: string }): Income {
        return {
            id: row.id,
            serverId: row.serverId,
            name: row.name,
            amount: row.amount,
            date: row.date,
            description: row.description,
            updatedAt: row.updatedAt,
            category: row.category,
            type: row.type,
        };
    }
    private mapIncomes(rows:
        {
            id: number,
            serverId: number | null,
            name: string,
            amount: number,
            date: string,
            description: string,
            updatedAt: string,
            category: string,
            type: string
        }[]): Income[] {
        return rows.map((row) => {
            return {
                id: row.id,
                serverId: row.serverId,
                name: row.name,
                amount: row.amount,
                date: row.date,
                description: row.description,
                updatedAt: row.updatedAt,
                category: row.category,
                type: row.type,
            };
        });
    }
    async allIncome(): Promise<Income[]> {
        const data = await this.db.select().from(income).execute();
        return this.mapIncomes(data);
    }
    async incomeById(id: number): Promise<Income | null> {
        const data = await this.db.select().from(income).where(eq(income.id, id)).execute();
        if (!data || data.length === 0) {
            return null;
        }
        return this.mapIncome(data[0]);
    }
    async byIds(ids: number[]): Promise<Income[]> {
        if (ids.length === 0) {
            return [];
        }

        return this.mapIncomes(await this.db
            .select()
            .from(income)
            .where(inArray(income.id, ids)));
    }
    async allIncomeByYear(year: number): Promise<Income[]> {
        const dateString = year.toString();
        return this.mapIncomes(await this.db.select().from(income).where(like(income.date, dateString)).execute());
    }
    async allIncomeByYearTillMonth(year: number, month: number): Promise<Income[]> {
        const startDate = dayjs().year(year).month(0).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');

        const data = await this.db
            .select()
            .from(income)
            .where(
                and(
                    gte(income.date, startDate),
                    lte(income.date, endDate)
                )
            )
            .execute();

        return this.mapIncomes(data);
    }
    async allIncomeByMonthAndYear(month: number, year: number): Promise<Income[]> {
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');

        const data = await this.db
            .select()
            .from(income)
            .where(
                lte(income.date, endDate)
            )
            .execute();

        return this.mapIncomes(data);
    }
    async allIncomeBeforeMonthAndYear(month: number, year: number): Promise<Income[]> {
        const endDate = dayjs().year(year).month(month - 1).endOf('month').format('YYYY-MM-DD');

        const data = await this.db
            .select()
            .from(income)
            .where(
                lte(income.date, endDate)
            )
            .execute();

        return this.mapIncomes(data);
    }
    async allIncomeByGroupedByType(year: number): Promise<HouseHoldStatistic[]> {
        const income = await this.allIncome();
        return from(income).where(o => dayjs(o.date).year() === year).groupBy(o => o.type).select(g => {
            return {
                type: g.key,
                amount: g.toArray().reduce((total, income) => total + Number(income.amount), 0),
            }
        }).toArray();
    }
    async allIncomeByMonthAndYearGroupedByType(month: number, year: number): Promise<HouseHoldStatistic[]> {
        const income = await this.allIncomeByMonthAndYear(month, year);
        return from(income).groupBy(o => o.type).select(g => {
            return {
                type: g.key,
                amount: g.toArray().reduce((total, income) => total + Number(income.amount), 0),
            }
        }).toArray();
    }
    async allIncomeByMonthAndYearNameAndType(month: number, year: number, name: string | undefined, type: string | undefined) {
        const income = await this.allIncomeByMonthAndYear(month, year);
        if (!name && !type) {
            return income;
        }
        else if (name && !type) {
            return income.filter((i) => {
                return i.name.toLowerCase().indexOf(name.toLocaleUpperCase()) >= 0;
            });
        }
        else if (!name && type) {
            return income.filter((i) => {
                return i.type.toLowerCase().indexOf(type.toLocaleUpperCase()) >= 0;
            });
        }
        return income.filter((i) => {
            return i.name.toLowerCase().indexOf(name!.toLocaleUpperCase()) >= 0 || i.type.toLowerCase().indexOf(type!.toLocaleUpperCase()) >= 0;
        });
    }
    // async incomeYears(): Promise<HouseHoldStatisticYear[]> {
    //     const tIncome = await this.getAll(STORE_NAME)
    //     const income = tIncome.map(o => {
    //         return {
    //             ...o,
    //             date: moment(o.date).toDate(),
    //         };
    //     });
    //     return from(income).groupBy(o => moment(o.date).year()).select(g => {
    //         return {
    //             year: g.key,
    //         }
    //     }).toArray();
    // }
    async saveIncome(data: Income): Promise<void> {
        if (data.id) {
            await this.db.update(income).set({
                id: data.id,
                serverId: data.serverId,
                name: data.name,
                amount: data.amount,
                date: dayjs(data.date).format('YYYY-MM-DD'),
                description: data.description,
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
                category: data.category,
                type: data.type,
            }).where(eq(income.id, data.id));
        }
        else {
            await this.db.insert(income).values({
                name: data.name,
                serverId: data.serverId,
                amount: data.amount,
                date: dayjs(data.date).format('YYYY-MM-DD'),
                description: data.description,
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
                category: data.category,
                type: data.type,
            });
        }
    }
    async deleteIncome(id: number): Promise<void> {
        await this.db.delete(income).where(eq(income.id, id));
    }
}
