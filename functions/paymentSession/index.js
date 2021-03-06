const fetch = require("node-fetch")
require('dotenv').config()

exports.handler = async function (event) {
  try {
    const request = event.queryStringParameters
    const { publicToken } = request.publicToken

    const resp = await fetch(`${process.env.SNIPCART_PAYMENT_SESSION_URL}?publicToken=${publicToken}`,{
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
