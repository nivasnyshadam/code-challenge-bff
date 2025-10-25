export interface Item {
    id: string;
    sku: string;
    name: string;
    price: number;
    category: string;
    stockQuantity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}