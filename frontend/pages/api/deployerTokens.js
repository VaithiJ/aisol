// pages/api/deployerTokens.js
export default async function handler(req, res) {
    const { deployer } = req.query;
    const apiUrl = `https://frontend-api.pump.fun/coins/user-created-coins/${deployer}?limit=100&offset=1&includeNsfw=true`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching deployer tokens, status: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch deployer tokens', error: error.message });
    }
  }
  