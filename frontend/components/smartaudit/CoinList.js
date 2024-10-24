import React from 'react';

const coins = [
  {
    rank: 1,
    token: "DIGGY",
    price: "$0.0004616",
    age: "11h",
    txns: "37,000",
    volume: "$5.5M",
    makers: "11,721",
    change5m: "-4.44%",
    change1h: "-6.39%",
    change24h: "7.98%",
    liquidity: "$77K",
    mcap: "$351K"
  },
  // Add more coin data here...
];

const CoinList = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-900 text-white">
        <thead>
          <tr>
            <th className="py-3 px-6">#</th>
            <th className="py-3 px-6">TOKEN</th>
            <th className="py-3 px-6">PRICE</th>
            <th className="py-3 px-6">AGE</th>
            <th className="py-3 px-6">TXNS</th>
            <th className="py-3 px-6">VOLUME</th>
            <th className="py-3 px-6">MAKERS</th>
            <th className="py-3 px-6">5M</th>
            <th className="py-3 px-6">1H</th>
            <th className="py-3 px-6">24H</th>
            <th className="py-3 px-6">LIQUIDITY</th>
            <th className="py-3 px-6">MCAP</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={index} className="bg-gray-800 border-b border-gray-700">
              <td className="py-3 px-6 text-center">{coin.rank}</td>
              <td className="py-3 px-6">{coin.token}</td>
              <td className="py-3 px-6">{coin.price}</td>
              <td className="py-3 px-6">{coin.age}</td>
              <td className="py-3 px-6">{coin.txns}</td>
              <td className="py-3 px-6">{coin.volume}</td>
              <td className="py-3 px-6">{coin.makers}</td>
              <td className={`py-3 px-6 ${coin.change5m.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{coin.change5m}</td>
              <td className={`py-3 px-6 ${coin.change1h.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{coin.change1h}</td>
              <td className={`py-3 px-6 ${coin.change24h.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{coin.change24h}</td>
              <td className="py-3 px-6">{coin.liquidity}</td>
              <td className="py-3 px-6">{coin.mcap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinList;
