import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components";
import {graphql} from 'gatsby';

export const PaymentStatus = (props) => {
  const [loading, setLoading] = useState(false);
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
      setLoading(true)
      const response = await axios.post(
        `${process.env.GATSBY_CONFIRM_PAYMENT_URL}`,
        body
      );
      response && setLoading(false);
      window.location.href = response.data.returnUrl;
    } catch (err) {
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
      {error.state && <h1>{error.msg}</h1>}
      {loading && <h1>checking payment status...</h1>}
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
