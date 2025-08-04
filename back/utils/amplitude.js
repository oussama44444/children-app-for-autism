// amplitude.js
const axios = require('axios');
const AMPLITUDE_API_KEY = '73bdaa0f1a61781c0e16e61f6f217372'; // Replace with your real key

async function trackOrderConfirmed({ userId, orderId, total }) {
  try {
    await axios.post('https://api2.amplitude.com/2/httpapi', {
      api_key: AMPLITUDE_API_KEY,
      events: [
        {
          user_id: userId,
          event_type: 'Commandes Passées',
          event_properties: {
            order_id: orderId,
            total: total,
            currency: 'USD',
          }
        }
      ]
    });
  } catch (err) {
    console.error('Amplitude error:', err.message);
  }
}

module.exports = { trackOrderConfirmed };
