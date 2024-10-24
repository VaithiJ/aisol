const axios = require('axios');

async function getPumpTokenInfo(tokenId) {
  const url = `https://pumpapi.fun/api/get_metadata/${tokenId}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return {
        name: response.data.name,
        ticker: response.data.ticker,
        image: response.data.image,
        // Add other fields as needed based on the API response
      };
    } else {
      console.error("Error retrieving data:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Example usage
const tokenId = "BnstdXi2ahnr7jTpN7aKv1ZhRTkaaB9DLJtaZdDTpump";

getPumpTokenInfo(tokenId)
  .then(info => {
    if (info) {
      console.log(`Name: ${info.name}`);
      console.log(`Ticker: ${info.ticker}`);
      console.log(`Image: ${info.image}`);
    } else {
      console.log("Failed to retrieve information.");
    }
  })
  .catch(error => console.error("Error:", error));

