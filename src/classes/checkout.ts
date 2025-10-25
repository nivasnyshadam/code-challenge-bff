import { FixedAmountDiscount, BulkPurchaseDiscount } from "../interfaces/discounts.js";
import { Item } from "../interfaces/item.js";
import { items } from "../data/items.js";
import { Discounts } from "./discounts.js";
import { ScannedList } from "../interfaces/scannedList.js";
export class Checkout {
    pricingRules: (FixedAmountDiscount | BulkPurchaseDiscount)[];
    items: Item[] = [];
    scannedList: ScannedList[] = [];
    applicableDiscount: number;
    discountsHelper = new Discounts();

    constructor(pricingRules: (FixedAmountDiscount | BulkPurchaseDiscount)[]) {
        this.pricingRules = pricingRules;
        this.scannedList = [];
        this.applicableDiscount = 0;
        this.discountsHelper = new Discounts();
    }

    async scan(sku: string) {
        // Transform items object to array of Item objects
        const itemsArray: Item[] = Object.entries(items).map(([ItemSKU, itemData]) => ({
            ItemSKU,
            ...(itemData as Item)
        }));
        const foundItem = itemsArray.find(i => i.sku === sku);
        if (foundItem) {
            this.items.push(foundItem);
            console.log(`Scanned item: ${foundItem.name}, Price: ${foundItem.price}`);
            this.scannedList.some(item => item.sku === foundItem.sku) ?
                this.scannedList.map(item => {
                    if (item.sku === foundItem.sku) {
                        item.quantity += 1;
                        item.total += foundItem.price;
                    }
                }) :
                this.scannedList.push({ sku: foundItem.sku, quantity: 1, total: foundItem.price, discount: 0 });

            return foundItem;
        }
        console.log(`Item with SKU ${sku} not found.`);
        return null;
    }

    async total(): Promise<number> {
        let total = 0;
        console.log("\nCalculating total price for scanned items...");
        console.log("checkout list", this.scannedList);
        for (const item of this.items) {
            total += item.price;
        }
        await this.discountsHelper.checkDiscountElgibility({
            itemsList: this.scannedList,
            pricingRules: this.pricingRules
        }).then(res => {
            this.applicableDiscount = res;
            console.log("\nTotal applicable discounts:", this.applicableDiscount);
            console.log("Final total after discounts:", total - this.applicableDiscount);
            return total - this.applicableDiscount;
        }
        ).catch(err => {
            console.error("Error checking discount eligibility:", err);

            return 0;
        }).finally(() => {
            console.log("\nFinal total after discounts:", total - this.applicableDiscount);
        });
        return total - this.applicableDiscount;

    }

}