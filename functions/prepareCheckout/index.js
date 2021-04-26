const https = require('https');
const querystring = require('querystring');
require('dotenv').config()

exports.handler = async (event) => {
	const cartData = JSON.parse(event.body)
	console.log(cartData)
    try{
		const path='/v1/checkouts';
		const data = querystring.stringify({
			'entityId': `${process.env.ENTITY_ID}`,
			'amount':`${cartData.amount}`,
			'currency':'ZAR',
			'paymentType':'DB',
		});
		const options = {
			port: 443,
			host: `${process.env.HOST_URL}`,
			path: path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': data.length,
				'Authorization':`Bearer ${process.env.PEACH_PAYMENT_TOKEN}`	
			}
		};

	   const prepareCheckout= () => {
		return new Promise((resolve, reject) => {
			const postRequest = https.request(options, function(res) {
				const buf = [];
				res.on('data', chunk => {
					buf.push(Buffer.from(chunk));
				});
				res.on('end', () => {
					const jsonString = Buffer.concat(buf).toString('utf8');
					try {
						resolve(JSON.parse(jsonString));
					} catch (error) {
						reject(error);
					}
				});
			});
			postRequest.on('error', reject);
			postRequest.write(data);
			postRequest.end();
		});
		};

		const responseData = await prepareCheckout() 
        console.log("response",responseData)
	return {
		statusCode:200,
		body: JSON.stringify(responseData)
	} 
	}
	catch(error){
      console.log(error)
	}
};



