exports.handler = async function (event) {
 import uuid from 'uuid';

     const requestBody={
         amount :0.00,
         payment : "fdsfsadf"
     }
    console.log(`Refunding ${requestBody.amount}$ on payment ${requestBody.paymentId}.`);
  
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refundId: uuid(),
      })
    };
  }