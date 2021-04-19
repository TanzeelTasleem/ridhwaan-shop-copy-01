import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import Head from "../components/Head/Head"
require("dotenv").config()

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ state: false, msg: "" })
  const [paymentSession, setPaymentSession] = useState("")
  const [checkoutDetails, setCheckoutDetails] = useState({ data: { id: "" } })
  const paymentSessionRef = useRef()
  const checkoutDetailsRef = useRef()
  paymentSessionRef.current = paymentSession
  checkoutDetailsRef.current = checkoutDetails

  const prepareCheckout = async () => {
    const body = JSON.stringify({
      amount: paymentSessionRef.current.data.invoice.amount,
    })

    const result = await axios.post("https://peachpayment.netlify.app/.netlify/functions/prepareCheckout",body)

    if (!result) {
      setError({ ...error, state: true })
    }
    setCheckoutDetails(result)
    console.log("checkout details", checkoutDetailsRef.current)
  }

  const getPaymentSession = async () => {
    setLoading(true)
    const publicToken = new URLSearchParams(window.location.search).get("publicToken")
    
    try {
      const response = await axios.get(`https://payment.snipcart.com/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`)
      setPaymentSession(response)
      console.log("paymentSession", paymentSessionRef.current)
      await prepareCheckout()
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    (async () => {
      await getPaymentSession()
    })()
  }, [])

  return (
    <div>
      {error.state && <h1> {error.msg} </h1>}
      {loading && <h1> loading ...</h1>}
      {
        checkoutDetails.data.id && 
        <div>
          <Head id={checkoutDetails.data.id}/>
            <form action={`https://peachpayment.netlify.app/paymentStatus?paymentSessionId=${paymentSession.data.id}`} class="paymentWidgets" data-brands="VISA AMEX MASTER"></form>
       </div>
      }
    </div>
  )
}

export default CheckoutForm
