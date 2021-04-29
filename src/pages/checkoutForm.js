import axios from "axios";
import { graphql } from "gatsby";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components";
import Head from "../components/Head/Head";

export const CheckoutForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ state: false, msg: "" });
  const [paymentSession, setPaymentSession] = useState("");
  const [checkoutDetails, setCheckoutDetails] = useState({ data: { id: "" } });
  const paymentSessionRef = useRef();
  const checkoutDetailsRef = useRef();
  paymentSessionRef.current = paymentSession;
  checkoutDetailsRef.current = checkoutDetails;

  const prepareCheckout = async () => {
    const body = JSON.stringify({
      amount: paymentSessionRef.current.data.invoice.amount,
    });

    const result = await axios.post(
      `${process.env.PREPARE_CHECKOUT_URL}`,
      body
    );

    if (!result) {
      setError({ ...error, state: true });
    }
    setCheckoutDetails(result);
    console.log("checkout details", checkoutDetailsRef.current);
  };

  const getPaymentSession = async () => {
    const publicToken = new URLSearchParams(window.location.search).get(
      "publicToken"
    );

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.SNIPCART_PAYMENT_SESSION_URL}?publicToken=${publicToken}`
      );
      setPaymentSession(response);
      console.log("paymentSession", paymentSessionRef.current);
      const result = await prepareCheckout();
      result && setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      await getPaymentSession();
    })();
  }, []);

  return (
    <Layout {...props}>
      {error.state && <h1> {error.msg} </h1>}
      {loading && <h1> loading ...</h1>}
      <h1>{`PREPARE_CHECKOUT_URL====${process.env.PREPARE_CHECKOUT_URL}`}</h1>
      <h1>{`SNIPCART_PAYMENT_SESSION_URL====${process.env.SNIPCART_PAYMENT_SESSION_URL}`}</h1>
      {checkoutDetails.data.id && (
        <div>
          <Head id={checkoutDetails.data.id} />
          <div style={{ height: "100vh" }}>
          <form
            action={`https://ridhwaan-shop.netlify.app/paymentStatus?paymentSessionId=${paymentSession.data.id}`}
            class="paymentWidgets"
            data-brands="VISA AMEX MASTER"
          ></form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CheckoutForm;

export const query = graphql`
  query($url: String) {
    sitePage(path: { eq: $url }) {
      id
    }
  }
`;
