import { FixedAmountDiscount,BulkPurchaseDiscount } from "../interfaces/discounts.js";
import { ScannedList } from "../interfaces/scannedList";

export class Discounts {
    total: number = 0;
    applicableDiscounts: ( FixedAmountDiscount | BulkPurchaseDiscount)[] = [];
    constructor() {
        this.total = 0;
    }

    async applyFixedAmountDiscount(
        item: ScannedList, 
        discount: { 
            amountOff: number; 
            minPurchaseAmount?: number; 
        }): Promise<number> {
        if (discount.minPurchaseAmount === undefined || item.total >= discount.minPurchaseAmount) {
            return discount.amountOff * item.quantity;
        }
        return 0;
    }

    async applyBulkPurchaseDiscount(
        items: ScannedList, 
        discount: { 
            buyQty: number; 
            getQty: number; 
            sku: string; 
        }): Promise<number> {
        const itemCount = items.quantity
        const freeItems = Math.floor(itemCount / (discount.buyQty + discount.getQty)) * discount.getQty;
        const itemPrice = items.total || 0;
        return freeItems * (itemPrice / itemCount);
    }

    async checkDiscountElgibility({ 
        itemsList, 
        pricingRules 
    }: { 
        itemsList: ScannedList[], 
        pricingRules: (FixedAmountDiscount | BulkPurchaseDiscount)[] 
    }): Promise<number> {
        const listOfItems: string[] = Array.from(new Set(itemsList.reduce((acc: string[], item) => {
            acc.push(item.sku);
            return acc;
        }, [])));
        await Promise.allSettled(listOfItems.map(async (sku) => { 
            pricingRules
                .filter(pricingRule => pricingRule.sku === sku && pricingRule.isActive)
                .forEach(async pricingRule => {
                    switch (pricingRule.type) {
                        case "fixed":
                            
                            const fixedItemIndex = itemsList.findIndex(item => item.sku === sku);
                            const adjustedTotal = await this.applyFixedAmountDiscount(
                                itemsList[fixedItemIndex], 
                                { 
                                    amountOff: typeof pricingRule.amountOff === "number" ? pricingRule.amountOff : 0, 
                                    minPurchaseAmount: typeof pricingRule.minPurchaseAmount === "number" ? pricingRule.minPurchaseAmount : undefined 
                                });
                            itemsList[fixedItemIndex].discount < adjustedTotal ? itemsList[fixedItemIndex].discount= adjustedTotal : itemsList[fixedItemIndex].discount= itemsList[fixedItemIndex].discount;
                            break;
                        case "bulk":
            
                            const bulkItemIndex = itemsList.findIndex(item => item.sku === sku);
                            const bulkDiscount = await this.applyBulkPurchaseDiscount(
                                itemsList[bulkItemIndex], 
                                { 
                                    buyQty: typeof pricingRule.buyQty === "number" ? pricingRule.buyQty : 0, 
                                    getQty: typeof pricingRule.getQty === "number" ? pricingRule.getQty : 0, 
                                    sku: pricingRule.sku 
                                })
                            itemsList[bulkItemIndex].discount < bulkDiscount ? itemsList[bulkItemIndex].discount= bulkDiscount : itemsList[bulkItemIndex].discount= itemsList[bulkItemIndex].discount;
                            break;
                        default:
                            // Optionally handle unknown types
                            break;
                    }
                });
        }));
        for (const item of itemsList) {
            this.total += item.discount;
        }
        return this.total;
    }
}

