interface BaseDiscount {
  id: string;
  name: string;
  sku: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}


export interface FixedAmountDiscount extends BaseDiscount {
  type: "fixed";
  amountOff: number;           // e.g: 20 for $20 off
  minPurchaseAmount?: number;  // optional threshold for discount
}

export interface BulkPurchaseDiscount extends BaseDiscount {
  type: "bulk";
  buyQty: number;              // e.g: buy 3
  getQty: number;              // e.g: get 1 free
}


