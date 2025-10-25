# code-challenge-bff

## Project Name: Checkout System (TypeScript + Node.js)

## Description:
This project implements a simple checkout system using TypeScript. It supports scanning items, applying discounts, and calculating totals based on pricing rules. The system includes both fixed and bulk purchase discount types.

Version: 1.0.0
Node Version: v16.16.0

## Environment:
Package Manager: npm
Build Tool: TypeScript Compiler (tsc)

## Folder Structure
src/
  app.ts
  classes/
    checkout.ts
  data/
    discounts.json
  tests/
    app.spec.ts

## Usage:
1. Install dependencies:
   npm install

2. Build the project:
   npm run build

3. Run the project manually:
   node dist/app.js

4. Run tests:
   npm run test

### Output Summary:
1. For inputItems2: The total was 249.00
2. For inputItems3: The total was 2718.95

### Test Summary:
All totals matched expected outputs successfully.

### Project Flow:
1. Items are scanned using the Checkout class.
2. The pricing rules are applied from the discounts configuration.
3. Fixed and bulk discounts are processed.
4. The final total is computed and displayed.

### Example Run:
Scanned item: Apple TV, Price: 109.5
Scanned item: Super iPad, Price: 549.99
Calculating total price for scanned items...
Total applicable discounts: 250
Final total after discounts: 2718.95

Total price: 2718.95

All tests passed successfully.
