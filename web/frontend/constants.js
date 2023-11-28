// Defines deposit values
export const depositValue = {
    NoDeposit: 0.0,
    Deposit25: 25.0,
    Deposit50: 50.0,
    Deposit75: 75.0,
    FullDeposit: 100.0,
  };
  
  // Defines when to fulfill the order
  export const sellingPlanFulfillmentTrigger = {
    Asap: "ASAP",
    Unknown: "UNKNOWN",
  };
  
  // Defines when to update the inventory
  export const sellingPlanReserve = {
    OnSale: "ON_SALE",
    OnFulfillment: "ON_FULFILLMENT",
  };
  
  // Defines when to charge the remaining balance
  export const sellingPlanRemainingBalanceChargeTrigger = {
    NoRemainingBalance: "NO_REMAINING_BALANCE",
    ExactTime: "EXACT_TIME",
  };
  