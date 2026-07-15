export interface OutgoingBase {
    id: number | null;
    clientId: number | null;
    name: string;
    date: string;
    updatedAt: string;
    description: string;
    category: string;
    type: string;
    installmentPaymentId: number | null;
}
export interface Outgoing extends OutgoingBase {
    amount: number;
}