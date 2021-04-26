const uuid = require("uuid")
const https = require("https")
const axios = require("axios")
require('dotenv').config()

exports.handler = async (event) => {
  // Retrieve payment information (depends on how your application is made)
  console.log(event)
  const paymentId = uuid()
  const body = JSON.parse(event.body)
  let path = `${body.resourcePath}?entityId=${process.env.ENTITY_ID}`
  let paymentSessionId = body.paymentSessionId

  console.log("resource path ==========",path)

  console.log("paymentSessionId", paymentSessionId)

  const options = {
    port: 443,
    host: `${process.env.HOST_URL}`,
    path: path,
    method: "GET",
    headers: {
      Authorization:
        `Bearer ${process.env.PEACH_PAYMENT_TOKEN}`,
    },
  }

  const peachPaymentStatus = () => {
    return new Promise((resolve, reject) => {
      const postRequest = https.request(options, function (res) {
        const buf = []
        res.on("data", chunk => {
          buf.push(Buffer.from(chunk))
        })
        res.on("end", () => {
          const jsonString = Buffer.concat(buf).toString("utf8")
          try {
            resolve(JSON.parse(jsonString))
          } catch (error) {
            reject(error)
          }
        })
      })
      postRequest.on("error", reject)
      postRequest.end()
    })
  }

  const paymentStatus = await peachPaymentStatus()
  console.log("peachPayemnt Status",paymentStatus.result.code === "000.100.110")  

  const data={
    paymentSessionId: paymentSessionId,
    state: "processed",
    transactionId: paymentId,
    instructions: 'Your payment will appear on your statement in the coming days',
    links: { refunds: `https://paymentrequest-custom-gateway.snipcart.vercel.app/api/refund?transactionId=${paymentId}` },
  }

  const optionsAxios = {
    headers: {
      Authorization: `Bearer ${process.env.SNIPCART_API_KEY}`,
    }
  }
  
  try{

    if(paymentStatus.result.code === "000.100.110"){
      const response = await axios.post('https://payment.snipcart.com/api/private/custom-payment-gateway/payment',data,optionsAxios);
      console.log("data from response",await response)
      return {
        statusCode : 200,
        body:JSON.stringify({
          ok:true,
          returnUrl : response.data.returnUrl
        })
      }  
    }
    else{
      const reqData = {...data , state: "failed"}
      console.log("******** req data*********",reqData)
      const response = await axios.post('https://payment.snipcart.com/api/private/custom-payment-gateway/payment',reqData,optionsAxios);
      console.log("data from response",await response)
      return {
        statusCode : 200,
        body:JSON.stringify({
          ok:true,
          returnUrl : response.data.returnUrl
        })
      }  
    }
  }
  catch(err){
    console.log("err from catch",err)
  }
   
}