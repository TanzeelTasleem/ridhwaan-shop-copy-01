import React from 'react';
import { Helmet } from 'react-helmet';

function Head({id}) {
  console.log(id)

  return (
    <Helmet>
     {
        typeof window !== `undefined` &&
        <script type="text/javascript" async src={`https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${id}`}>
        </script>
     }
    </Helmet>
  );
}

export default Head;

