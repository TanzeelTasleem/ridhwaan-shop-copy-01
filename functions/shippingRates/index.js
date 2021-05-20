const axios = require("axios");
const uuid = require("uuid");
require("dotenv").config();

exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  if ((data.eventName = "shippingrates.fetch")) {
    const { content: { shippingAddress }} = data;
    const {content: { items }} = data;

    const packgesWeight = items.map((item)=> item.totalWeight)

    const totalWeight = packgesWeight.reduce((a, b) => a + b, 0)

    console.log("weight array ****",packgesWeight)

    console.log( "total weight *********** ",
    packgesWeight.reduce((a, b) => a + b, 0)
    )

    const body = {
      WS_Key: `${process.env.SHIP2_API_TOKEN}`,
      Sender: {
        Address1: "203 Montevideo, 4 Ninth Street",
        City: "Johannesburg",
        Country: "ZA",
        IsResidential: true,
        PostalCode: "2193",
      },
      Recipient: {
        Address1: `${shippingAddress.fullAddress}`,
        City: `${shippingAddress.city}`,
        CompanyName: "Ridhwaan",
        Country: `${shippingAddress.country}`,
        IsResidential: false,
        PostalCode: `${shippingAddress.postalCode}`,
      },
      Packages: [
        {
          Weight: totalWeight / 454
        },
      ],
    };

    try {
      const result = await axios.post(`${process.env.SHIPPING_RATE_URL}`, body);
      const couriersData = result.data[0]["Services"];
      const couriersList = couriersData.map((obj) => {
        return {
          cost: obj.CustomerPrice.Total,
          description: obj.Service.Name,
          userDefinedId: uuid.v4(),
        };
      });

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rates: couriersList,
        }),
      };
    } catch (error) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          errors: [
            {
              key: error.response.data.Message,
              message: error.response.data.ExceptionMessage,
            },
          ],
        }),
      };
    }
  }
};
