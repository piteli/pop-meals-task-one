export interface OrdersTableDataModel {
    status: string;
    date: string;
    time: string;
    order_num: number;
    total: string;
}

export interface PayloadResponseOrdersModel {
    order_id: number;
    arrives_at_utc: number;
    paid_with: string;
    total_paid: number;
}