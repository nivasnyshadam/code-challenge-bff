import { FixedAmountDiscount, BulkPurchaseDiscount} from "./interfaces/discounts.js";
import { Checkout } from "./classes/checkout.js";
import {discounts} from "./data/discounts.js";

type PricingRule = FixedAmountDiscount | BulkPurchaseDiscount;

export async function priceWithRules(items: string[], rules?: PricingRule[]): Promise<void | number> {
  const pricingRules: PricingRule[] = rules ? rules :
    (discounts as PricingRule[]).map((discount: any) => {
      switch (discount.type) {
        case "fixed": return discount as FixedAmountDiscount;
        case "bulk":  return discount as BulkPurchaseDiscount;
        default: throw new Error(`Unknown discount type: ${discount.type}`);
      }
    });

  const co = new Checkout(pricingRules);
  for (const sku of items){ 
    co.scan(sku); 
 }
 const total = await co.total()
 console.log(`Total price: $${total?.toFixed(2)}`);
  return total;
}

// Optional: keep a quick manual run
if (require.main === module) {
  const inputItems3 = ["atv", "ipd", "ipd", "atv", "ipd", "ipd", "ipd"];
  priceWithRules(inputItems3, discounts as PricingRule[])
    .then((total) => console.log("Total:", total))
    .catch((err) => console.error(err));
}