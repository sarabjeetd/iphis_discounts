let discountObj = {
    minimum_required_quantity:5,
    usd:60
  }

// console.log(discountObj);

let input = {
    cart:{
        lines:[{
            cost:{ amountPerQuantity: 18},
            id:"ABC121",
            quantity:1
        },
        {
            cost:{ amountPerQuantity: 20},
            id:"ABC122",
            quantity:4
        },
        {
            cost:{ amountPerQuantity: 23},
            id:"ABC123",
            quantity:0
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


for (const line of input.cart.lines) {
  if((cp + line.quantity) <= sets*discountObj.minimum_required_quantity ){
    cp += line.quantity;
    totalAmount += line.quantity * line.cost.amountPerQuantity;
  }
  else{
    var diff = (sets*discountObj.minimum_required_quantity) - cp;
    totalAmount += diff * line.cost.amountPerQuantity;
  }
}

console.log("total quantity = "+ totalQuantity);
console.log("total amount = "+ totalAmount);


if(sets > 0){
    var totalDiscountOffered = totalAmount - (discountObj.usd * sets);
    console.log("total discount = "+totalDiscountOffered);
    
    

    var aver = totalDiscountOffered/discountObj.minimum_required_quantity * sets;
    
    
    // var aver = totalDiscountOffered/totalQuantity;
    console.log("average = "+aver);
    
    var i = 0;
    var count_processes = 0;
    var multiplier = 0;

    var totalForDiscount =0;
    var totalNotForDiscount =0;

    var discounts=[];
    
    for (const line of input.cart.lines) {
        if(i < sets*discountObj.minimum_required_quantity){
            if((count_processes + line.quantity) <= sets*discountObj.minimum_required_quantity ){
                count_processes += line.quantity;
                multiplier = line.quantity;
                i = count_processes-1;
                
               
            }
            else{
               var difference = (sets*discountObj.minimum_required_quantity) - count_processes;
                multiplier = difference;
            }

            // var product_perc = Math.round(((multiplier * aver)/line.cost.amountPerQuantity)*100 *100)/100;
            var line_total = multiplier*line.cost.amountPerQuantity;
            var product_perc = Math.round(((aver*multiplier)/line_total)*100*100)/100;

            var discounted_amount = line_total - aver;
            var affected_price = line_total - discounted_amount;

            console.log(line.id+  "   Discounted ==== " + discounted_amount);
            console.log( "   affected_price ==== " + affected_price);
            
            var discounted_product = {
                value: {
                  percentage: {
                    value: product_perc
                  }
                },
                targets: [
                  {
                    productVariant: {
                      id: line.id
                    }
                  }
                ],
                message: product_perc+"% off"
              };

            discounts.push(discounted_product);

           
           
            // console.log(line.id+ " percentage=" +product_perc);
            
            
            i++;
        }    
        
    }
}



// console.log(discounts);