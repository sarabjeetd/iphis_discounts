// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */

/**
 * @type {FunctionResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  
  // Extracting the amount and quantity
  const amount = configuration.discounts[0].value.fixedAmount.amount;
  const quantity = configuration.quantity;
  
  
  
/////////////////////

let discountObj = {
  minimum_required_quantity: quantity,
  USD:amount,
  CAD:amount,
  GBP:amount,
  EUR:amount,
  AUD:amount,
  MXN:amount,
  INR:amount,
}


let totalQuantity = 0;
let totalAmount = input?.cart?.cost?.subtotalAmount?.amount;
let storeCurrency = input?.cart?.cost?.subtotalAmount?.currencyCode
let cp =0;

for (const line of input?.cart?.lines) {
  totalQuantity += line.quantity;
}

var sets = Math.floor(totalQuantity / discountObj.minimum_required_quantity);

// for (const line of input?.cart?.lines) {
//   if((cp + line.quantity) <= sets * discountObj.minimum_required_quantity ){
//     cp += line.quantity;
//     totalAmount += line.quantity * line.cost.amountPerQuantity.amount;
//   }
//   else{
//     var diff = (sets*discountObj.minimum_required_quantity) - cp;
//     totalAmount += diff * line.cost.amountPerQuantity.amount;
//   }
// }

var products_price_array =[];
for (const line of input.cart.lines) {
    for(var i=0; i<line.quantity; i++){
      products_price_array.push(line.cost.amountPerQuantity.amount);
    } 
}
//sort array lowest to highest
products_price_array.sort();

if(sets > 0){
  var totalDiscountOffered = totalAmount - (discountObj[storeCurrency] * sets);

  const remaining_items = products_price_array.filter((element, index) => index >= discountObj.minimum_required_quantity*sets);


   //Sum of remaining items
   let remaining_sum = 0.0;

   // calculate sum using forEach() method
   remaining_items.forEach( num => {
     remaining_sum += parseFloat(num);
   })

   

   var total_discount = totalDiscountOffered - remaining_sum;
   var remaining_balance = totalAmount - total_discount;

   console.log("sets=="+sets);
   console.log("totalDiscountOffered=="+totalDiscountOffered);
   
   console.log("products_price_array==");
   console.log(JSON.stringify(products_price_array));

   console.log("remaining_items==");
   console.log(JSON.stringify(remaining_items));
 
   console.log("remaining_sum==");
   console.log(JSON.stringify(remaining_sum));

   console.log("total_discount=="+total_discount);
   console.log("TO BE CHARGED=="+remaining_balance);

console.log("LATEEST MANMOHAN FUNCTION");
console.log("currency code" + storeCurrency);

console.log("Total amount " + totalAmount);

   return {
    "discountApplicationStrategy": DiscountApplicationStrategy.First,
    "discounts": [
      {
        "value": {
          "fixedAmount": {
            "amount": total_discount
          }
        },
        "targets": [
          {
            "orderSubtotal": {
              "excludedVariantIds": [
              ]
            }
          }
        ],
        "message": ""+quantity+" for "+storeCurrency+" "+discountObj[storeCurrency]+" Discount Applied!"
      }
    ]
  }
  


}
///////////

  return EMPTY_DISCOUNT;
};