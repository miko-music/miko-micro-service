import { HouseHoldStatistic } from "../interfaces/house-hold-statistic.interface";
import { Outgoing } from "../interfaces/outgoing.interface";
import { OutgoingRepository } from "../repositories/outgoing.repository";

export class OutgoingService {
    constructor(private outgoingRepository: OutgoingRepository) { }
    async allOutgoing(): Promise<Outgoing[]> {
        return await this.outgoingRepository.allOutgoing();
    }
    async outgoingById(id: number): Promise<Outgoing | null> {
        return await this.outgoingRepository.outgoingById(id);
    }
    async byIds(ids: number[]): Promise<Outgoing[]> {
        return await this.outgoingRepository.byIds(ids);
    }
    async allOutgoingByYear(year: number): Promise<Outgoing[]> {
        return await this.outgoingRepository.allOutgoingByYear(year);
    }
    async allOutgoingByYearTillMonth(year: number, month: number): Promise<Outgoing[]> {
        return await this.outgoingRepository.allOutgoingByYearTillMonth(year, month);
    }
    async allOutgoingByMonthAndYear(month: number, year: number): Promise<Outgoing[]> {
        return await this.outgoingRepository.allOutgoingByMonthAndYear(month, year);
    }
    async allOutgoingBeforeMonthAndYear(month: number, year: number): Promise<Outgoing[]> {
        return await this.outgoingRepository.allOutgoingBeforeMonthAndYear(month, year);
    }
    async allOutgoingByGroupedByType(year: number): Promise<HouseHoldStatistic[]> {
        return await this.outgoingRepository.allOutgoingByGroupedByType(year);
    }
    async allOutgoingByMonthAndYearGroupedByType(month: number, year: number): Promise<HouseHoldStatistic[]> {
        return await this.outgoingRepository.allOutgoingByMonthAndYearGroupedByType(month, year);
    }
    async allOutgoingByMonthAndYearNameAndType(month: number, year: number, name: string | undefined, type: string | undefined) {
        return await this.outgoingRepository.allOutgoingByMonthAndYearNameAndType(month, year, name, type);
    }
    async saveOutgoing(data: Outgoing): Promise<void> {
        await this.outgoingRepository.saveOutgoing(data);
    }
    async deleteOutgoing(id: number): Promise<void> {
        await this.outgoingRepository.deleteOutgoing(id);
    }
}