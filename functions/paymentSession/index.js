const fetch = require("node-fetch")

exports.handler = async function (event) {
  try {
    console.log(event)
    const request = event.queryStringParameters
    console.log("PublicToken=", request.publicToken)

    const { publicToken } = request.publicToken

    const resp = await fetch(`https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`,{
      method:"GET"
    })

    console.log("response fron session api", JSON.stringify(resp))

    return {
      statusCode: 200,
      body: JSON.stringify(resp),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}
