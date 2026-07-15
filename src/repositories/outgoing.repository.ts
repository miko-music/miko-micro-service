import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { outgoing } from "../db/schema";
import type { Outgoing } from "../interfaces/outgoing.interface";
import { eq, inArray, like, gte, lte, and } from "drizzle-orm";
import dayjs from "dayjs";
import { HouseHoldStatistic } from "../interfaces/house-hold-statistic.interface";
import { from } from "linq-to-typescript";

export class OutgoingRepository {
    constructor(private db: BetterSQLite3Database) { }
    private mapOutgoing(row: {
        id: number,
        clientId: number | null,
        name: string,
        amount: number,
        date: string,
        description: string,
        updatedAt: string,
        category: string,
        type: string,
        installmentPaymentId: number | null
    }): Outgoing {
        return {
            id: row.id,
            clientId: row.clientId,
            name: row.name,
            amount: row.amount,
            date: row.date,
            description: row.description,
            updatedAt: row.updatedAt,
            category: row.category,
            type: row.type,
            installmentPaymentId: row.installmentPaymentId,
        };
    }
    private mapOutgoings(rows: {
        id: number,
        clientId: number | null,
        name: string,
        amount: number,
        date: string,
        description: string,
        updatedAt: string,
        category: string,
        type: string,
        installmentPaymentId: number | null
    }[]): Outgoing[] {
        return rows.map((row) => {
            return {
                id: row.id,
                clientId: row.clientId,
                name: row.name,
                amount: row.amount,
                date: row.date,
                description: row.description,
                updatedAt: row.updatedAt,
                category: row.category,
                type: row.type,
                installmentPaymentId: row.installmentPaymentId,
            };
        });
    }
    async allOutgoing(): Promise<Outgoing[]> {
        const data = await this.db.select().from(outgoing).execute();
        return this.mapOutgoings(data);
    }
    async outgoingById(id: number): Promise<Outgoing | null> {
        const data = await this.db.select().from(outgoing).where(eq(outgoing.id, id)).execute();
        if (!data || data.length === 0) {
            return null;
        }
        return this.mapOutgoing(data[0]);
    }
    async byIds(ids: number[]): Promise<Outgoing[]> {
        if (ids.length === 0) {
            return [];
        }
        return this.mapOutgoings(await this.db
            .select()
            .from(outgoing)
            .where(inArray(outgoing.id, ids)));
    }
    async allOutgoingByYear(year: number): Promise<Outgoing[]> {
        const dateString = year.toString();
        return this.mapOutgoings(await this.db.select().from(outgoing).where(like(outgoing.date, dateString)).execute());
    }
    async allOutgoingByYearTillMonth(year: number, month: number): Promise<Outgoing[]> {
        const startDate = dayjs().year(year).month(0).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');

        const data = await this.db
            .select()
            .from(outgoing)
            .where(
                and(
                    gte(outgoing.date, startDate),
                    lte(outgoing.date, endDate)
                )
            )
            .execute();

        return this.mapOutgoings(data);
    }
    async allOutgoingByMonthAndYear(month: number, year: number): Promise<Outgoing[]> {
        const endDate = dayjs().year(year).month(month).endOf('month').format('YYYY-MM-DD');

        const data = await this.db
            .select()
            .from(outgoing)
            .where(
                lte(outgoing.date, endDate)
            )
            .execute();

        return this.mapOutgoings(data);
    }
    async allOutgoingBeforeMonthAndYear(month: number, year: number): Promise<Outgoing[]> {
        const endDate = dayjs().year(year).month(month - 1).endOf('month').format('YYYY-MM-DD');

        const data = await this.db
            .select()
            .from(outgoing)
            .where(
                lte(outgoing.date, endDate)
            )
            .execute();

        return this.mapOutgoings(data);
    }
    async allOutgoingByGroupedByType(year: number): Promise<HouseHoldStatistic[]> {
        const income = await this.allOutgoing();
        return from(income).where(o => dayjs(o.date).year() === year).groupBy(o => o.type).select(g => {
            return {
                type: g.key,
                amount: g.toArray().reduce((total, income) => total + Number(income.amount), 0),
            }
        }).toArray();
    }
    async allOutgoingByMonthAndYearGroupedByType(month: number, year: number): Promise<HouseHoldStatistic[]> {
        const income = await this.allOutgoingByMonthAndYear(month, year);
        return from(income).groupBy(o => o.type).select(g => {
            return {
                type: g.key,
                amount: g.toArray().reduce((total, income) => total + Number(income.amount), 0),
            }
        }).toArray();
    }
    async allOutgoingByMonthAndYearNameAndType(month: number, year: number, name: string | undefined, type: string | undefined) {
        const income = await this.allOutgoingByMonthAndYear(month, year);
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

    async saveOutgoing(data: Outgoing): Promise<void> {
        if (data.id) {
            await this.db.update(outgoing).set({
                id: data.id,
                clientId: data.clientId,
                name: data.name,
                amount: data.amount,
                date: dayjs(data.date).format('YYYY-MM-DD'),
                description: data.description,
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
                category: data.category,
                type: data.type,
                installmentPaymentId: data.installmentPaymentId,
            }).where(eq(outgoing.id, data.id));
        }
        else {
            await this.db.insert(outgoing).values({
                name: data.name,
                clientId: data.clientId,
                amount: data.amount,
                date: dayjs(data.date).format('YYYY-MM-DD'),
                description: data.description,
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
                category: data.category,
                type: data.type,
                installmentPaymentId: data.installmentPaymentId,
            });
        }
    }
    async deleteOutgoing(id: number): Promise<void> {
        await this.db.delete(outgoing).where(eq(outgoing.id, id)).execute();
    }

}   