import assert from "assert";
import { priceWithRules } from "../app.js";
import { BulkPurchaseDiscount, FixedAmountDiscount } from "../interfaces/discounts.js";

const inputItems2 = ["atv", "atv", "atv", "vga"];
const inputItems3 = ["atv", "ipd", "ipd", "atv", "ipd", "ipd", "ipd"];

const output2 = 249.0;   // Expected total for inputItems2
const output3 = 2693.95; // Expected total for inputItems3


const runTests = [
    {
        "id": "disc01", 
        "sku": "atv", 
        "name": "3 for 2 Apple TVs",
        "type": "bulk",
        "buyQty": 2,
        "getQty": 1,
        "description": "Buy 3 Apple TVs for the price of 2",
        "isActive": true
    },{ "id": "disc02",
        "sku": "ipd",
        "name": "Super iPad bulk discount",
        "type": "fixed",
        "amountOff": 55,
        "minPurchaseAmount": 4,
        "description": "Get $55 off each Super iPad when you buy more than 4",
        "isActive": true 
    }
];

(async () => {
    const total2 = await priceWithRules(inputItems2, runTests as FixedAmountDiscount[] | BulkPurchaseDiscount[]);
    const total3 = await priceWithRules(inputItems3, runTests as FixedAmountDiscount[] | BulkPurchaseDiscount[]);
    console.log(`Total for inputItems2: $${total2?.toFixed(2)}`);
    console.log(`Total for inputItems3: $${total3?.toFixed(2)}`);
    // Compare results
    assert.strictEqual(Number(total2?.toFixed(2)), output2, `Case 2 failed: expected ${output2}, got ${total2}`);
    assert.strictEqual(Number(total3?.toFixed(2)), output3, `Case 3 failed: expected ${output3}, got ${total3}`);

    console.log("All totals match expected outputs!");
})();