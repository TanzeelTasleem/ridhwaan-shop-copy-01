import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components";

export const PaymentStatus = (props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ state: false, msg: "" });

  const checkPaymentStatus = async () => {
    const paymentSessionId = new URLSearchParams(window.location.search).get(
      "paymentSessionId"
    );

    const resourcePath = new URLSearchParams(window.location.search).get(
      "resourcePath"
    );

    const body = {
      paymentSessionId,
      resourcePath,
    };

    try {
      const response = await axios.post(
        "https://ridhwaan-shop-03fa0.netlify.app/.netlify/functions/paymentConfirm",
        body
      );
      setLoading(false);
      window.location.href = await response.data.returnUrl;
    } catch (err) {
      console.log(err);
      setError({
        state: true,
        msg: err.msg,
      });
    }
  };

  useEffect(() => {
    (async () => {
      await checkPaymentStatus();
    })();
  }, []);

  return (
    <Layout {...props}>
      <h1>checking payment status...</h1>
    </Layout>
  );
};

export default PaymentStatus;

export const query = graphql`
  query($url: String) {
    sitePage(path: { eq: $url }) {
      id
    }
  }
`;
