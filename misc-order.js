let discountObj = {
    minimum_required_quantity:5,
    usd:60
  }

// console.log(discountObj);

let input = {
    cart:{
        lines:[{
          cost:{ 
              amountPerQuantity: {
                "amount": 18,
                "currencyCode": "CAD"
              }
            },
            id:"ABC121",
            quantity:4
        },
        {
          cost:{ 
              amountPerQuantity: {
                amount: 22,
                currencyCode: "CAD"
              }
            },
            id:"ABC122",
            quantity:2
        },
        {
          cost:{ 
              amountPerQuantity: {
                amount: 20,
                currencyCode: "CAD"
            }
          },
            id:"ABC123",
            quantity:1
        },
    ]
    }
}



let cart_lines = input?.cart?.lines;

// console.log(cart_lines);

let totalQuantity = 0;
let totalAmount = 0;
let cp =0;



for (const line of input.cart.lines) {
  totalQuantity += line.quantity;
 }

var sets = Math.floor(totalQuantity / discountObj.minimum_required_quantity);
console.log("sets = "+ sets);


for (const line of input.cart.lines) {
  if((cp + line.quantity) <= sets*discountObj.minimum_required_quantity ){
    cp += line.quantity;
    totalAmount += line.quantity * line.cost.amountPerQuantity.amount;
  }
  else{
    var diff = (sets*discountObj.minimum_required_quantity) - cp;
    totalAmount += diff * line.cost.amountPerQuantity.amount;
  }
}

console.log("total quantity = "+ totalQuantity);
console.log("total amount = "+ totalAmount);

var products_price_array =[];
for (const line of input.cart.lines) {
    for(var i=0; i<line.quantity; i++){
      products_price_array.push(line.cost.amountPerQuantity.amount);
    } 
}

//sort array lowest to highest
products_price_array.sort();

console.log("================");
console.log(products_price_array);
console.log("================");

if(sets > 0){
  var totalDiscountOffered = totalAmount - (discountObj.usd * sets);
  console.log("total discount = "+totalDiscountOffered);

  const remaining_items = products_price_array.filter((element, index) => index >= discountObj.minimum_required_quantity*sets);
  
  console.log("Remaining Items");
  console.log(remaining_items);

  //Sum of remaining items
  let remaining_sum = 0;

  // calculate sum using forEach() method
  remaining_items.forEach( num => {
    remaining_sum += num;
  })

  console.log("Remaining SUM");
  console.log(remaining_sum) 


  var total_discount = totalDiscountOffered-remaining_sum;
  

  console.log("APLICABLE DISCOUNT");
  console.log(total_discount)  
    
  var remaining_balance = totalAmount - total_discount;

  console.log("FINAL AFTER DISCOUNT");
  console.log(remaining_balance)  


}
