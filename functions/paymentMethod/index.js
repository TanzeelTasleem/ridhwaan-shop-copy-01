const axios = require("axios");
require("dotenv").config();

exports.handler = async function (event) {
  console.log(event);

  const request = JSON.parse(event.body);

  const response = await axios.get(
    `https://payment.snipcart.com/api/public/custom-payment-gateway/validate?publicToken=${request.publicToken}`
  );

  // Return a 404 if the request is not from Snipcart
  if (!response.status == 200)
    return {
      statusCode: 404,
      body: "public token validation failed",
    };

  // Create a payment method list

  let paymentMethodList = [
    {
      id: "peach_payment",
      name: "Peach Payments",
      checkoutUrl: `${process.env.SITE_URL}/checkoutForm/?publicToken=${request.publicToken}`,
    },
  ];

  // Return successful status code and available payment methods
  return {
    statusCode: 200,
    body: JSON.stringify(paymentMethodList),
  };
};
