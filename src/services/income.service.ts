import { HouseHoldStatistic } from "../interfaces/house-hold-statistic.interface";
import { Income } from "../interfaces/income.interface";
import { IncomeRepository } from "../repositories/inome.repository";

export class IncomeService {
    constructor(
        private incomeRepository: IncomeRepository
    ) { }
    async allIncome(): Promise<Income[]> {
        return await this.incomeRepository.allIncome();
    }
    async incomeById(id: number): Promise<Income | null> {
        return await this.incomeRepository.incomeById(id);
    }
    async byIds(ids: number[]): Promise<Income[]> {
        return await this.incomeRepository.byIds(ids);
    }
    async allIncomeByYear(year: number): Promise<Income[]> {
        return await this.incomeRepository.allIncomeByYear(year);
    }
    async allIncomeByYearTillMonth(year: number, month: number): Promise<Income[]> {
        return await this.incomeRepository.allIncomeByYearTillMonth(year, month);
    }
    async allIncomeByMonthAndYear(month: number, year: number): Promise<Income[]> {
        return await this.incomeRepository.allIncomeByMonthAndYear(month, year);
    }
    async allIncomeBeforeMonthAndYear(month: number, year: number): Promise<Income[]> {
        return await this.incomeRepository.allIncomeBeforeMonthAndYear(month, year);
    }
    async allIncomeByGroupedByType(year: number): Promise<HouseHoldStatistic[]> {
        return await this.incomeRepository.allIncomeByGroupedByType(year);
    }
    async allIncomeByMonthAndYearGroupedByType(month: number, year: number): Promise<HouseHoldStatistic[]> {
        return await this.incomeRepository.allIncomeByMonthAndYearGroupedByType(month, year);
    }
    async allIncomeByMonthAndYearNameAndType(month: number, year: number, name: string | undefined, type: string | undefined) {
        return await this.incomeRepository.allIncomeByMonthAndYearNameAndType(month, year, name, type);
    }
    async saveIncome(data: Income): Promise<void> {
        await this.incomeRepository.saveIncome(data);
    }
    async deleteIncome(id: number): Promise<void> {
        await this.incomeRepository.deleteIncome(id);
    }
}