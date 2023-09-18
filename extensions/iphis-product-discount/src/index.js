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

/////////////////////

  let discountObj = {
    minimum_required_quantity:5,
    usd:60
  }


  let totalQuantity = 0;
  let totalAmount = 0;
  let cp =0;

  for (const line of input?.cart?.lines) {
    totalQuantity += line.quantity;
  }

  var sets = Math.floor(totalQuantity / discountObj.minimum_required_quantity);

  for (const line of input?.cart?.lines) {
    if((cp + line.quantity) <= sets * discountObj.minimum_required_quantity ){
      cp += line.quantity;
      totalAmount += line.quantity * line.cost.amountPerQuantity.amount;
    }
    else{
      var diff = (sets*discountObj.minimum_required_quantity) - cp;
      totalAmount += diff * line.cost.amountPerQuantity.amount;
    }
  }

  if(sets == 1){
    var totalDiscountOffered = totalAmount - (discountObj.usd * sets);

    var aver = totalDiscountOffered/discountObj.minimum_required_quantity * sets;
    var i = 0;
    var count_processes = 0;
    var multiplier = 0;

    var totalForDiscount =0;
    var totalNotForDiscount =0;
    var discounts=[];

    for (const line of input?.cart?.lines) {
      if(i < sets*discountObj.minimum_required_quantity){
          if((count_processes + line.quantity) <= sets*discountObj.minimum_required_quantity ){
              count_processes += line.quantity;
              multiplier = line.quantity;
              i = count_processes-1;
              
              // console.log("quatity in ="+multiplier);
          }
          else{
             var difference = (sets*discountObj.minimum_required_quantity) - count_processes;
              multiplier = difference;
              // totalAmount += difference * line.cost.amountPerQuantity;
              // console.log("quatity out ="+multiplier);

          }

          // var product_perc = Math.round(((multiplier * aver)/line.cost.amountPerQuantity)*100 *100)/100;
          var line_total = multiplier*line.cost.amountPerQuantity.amount;
          var product_perc = Math.round(((aver*multiplier)/line_total)*100*100)/100;
          // console.log(line.merchandise?.id+ " percentage=" +product_perc);
          


          var discounted_product = {
            value: {
              fixedAmount: {
                amount: aver * multiplier,
                appliesToEachItem:false
              }
            },
            targets: [
              {
                productVariant: {
                  id: line.merchandise?.id
                }
              }
            ],
            message: product_perc+"% off"
          };

          discounts.push(discounted_product);


          
          i++;
      }    
    }

    console.log("SARABJEET FUNCTION");
    console.log();
    console.log(aver);
    // console.log(JSON.stringify(discounts));

    // return {
    //   discountApplicationStrategy: DiscountApplicationStrategy.First,
    //   discounts: discounts
    // }
    return {
      "discountApplicationStrategy": "FIRST",
      "discounts": [
        {
          "value": {
            "fixedAmount": {
              "amount": aver,
              "appliesToEachItem": true
            }
          },
          "targets": [
            {
              "productVariant": {
                "id": "gid://shopify/ProductVariant/46559520096551",
                "quantity":3
              }
            },
            {
              "productVariant": {
                "id": "gid://shopify/ProductVariant/46559520129319",
                "quantity":2,
              }
            },
            {
              "productVariant": {
                "id": "gid://shopify/ProductVariant/46559519441191",
                "quantity":2
              }
            }
          ],
          "message": null
        }
        /*,
        {
          "value": {
            "fixedAmount": {
              "amount": 34,
              "appliesToEachItem": false
            }
          },
          "targets": [
            {
              "productVariant": {
                "id": "gid://shopify/ProductVariant/46559520162087"
              }
            }
          ],
          "message": "48.57% off"
        }*/
      ]
    }



  }
///////////


  



  return EMPTY_DISCOUNT;
};