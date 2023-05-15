import { useEffect, useState } from "react";
import { ICurrency } from "./models/ICurrency";
import axios from "axios";

interface ISort {
  column: keyof ICurrency;
  direction: number;
}

function CryptoCoins() {
  const [cryptos, setCryptos] = useState<ICurrency[]>([]);
  const [sort, setSort] = useState<ISort>({ column: "rank", direction: 1 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://api.coincap.io/v2/assets");
      setCryptos(response.data.data);
    };
    
    fetchData(); 
  
    const intervalId = setInterval(() => {
      fetchData(); 
    }, 5000);
  
    return () => clearInterval(intervalId);
  }, []);
  

  function formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else {
      return num.toFixed(2);
    }
  }

  function formatPrice(price: number) {
    if (price < 1) {
      const decimalPlaces = Math.max(-Math.floor(Math.log10(price)), 2);
      return price.toFixed(decimalPlaces);
    } else {
      return price.toFixed(2);
    }
  }

  const handleSort = (column: keyof ICurrency) => {
    if (column === "rank") {
      setSort({
        column,
        direction: sort.direction === 1 ? -1 : 1,
      });
    } else if (sort.column === column) {
      setSort({
        column,
        direction: sort.direction === 1 ? -1 : 1,
      });
    } else {
      setSort({
        column,
        direction: 1,
      });
    }
  };

  const sortedCryptos = cryptos.sort((a: ICurrency, b: ICurrency) => {
    const { column, direction } = sort;

    if (a[column] == null || b[column] == null) {
      return 0;
    }

    if (column === "name") {
      return a[column].localeCompare(b[column]) * direction;
    }

    if (column === "rank") {
      return (Number(a[column]) - Number(b[column])) * direction;
    }

    if (["priceUsd", "marketCapUsd", "volumeUsd24Hr"].includes(column)) {
      return (Number(a[column]) - Number(b[column])) * direction;
    }

    if (column === "changePercent24Hr") {
      const aChange = parseFloat(a[column]);
      const bChange = parseFloat(b[column]);
      return (aChange - bChange) * direction;
    }

    return 0;
  });

  return (
    <div className="app">
      <img id="logo" src="src\assets\logo.png" alt="Logo" />
      <table>
        <thead>
          <tr>
            <th>
              Rank{" "}
              <i
                className="fa-solid fa-sort"
                onClick={() => handleSort("rank")}
              ></i>
            </th>
            <th>
              Name{" "}
              <i
                className="fa-solid fa-sort"
                onClick={() => handleSort("name")}
              ></i>
            </th>
            <th>Symbol</th>
            <th>
              Price (USD){" "}
              <i
                className="fa-solid fa-sort"
                onClick={() => handleSort("priceUsd")}
              ></i>
            </th>
            <th id="marketCap">
              Market Cap (USD){" "}
              <i
                className="fa-solid fa-sort"
                onClick={() => handleSort("marketCapUsd")}
              ></i>
            </th>
            <th id="hVolume">
              24h Volume (USD){" "}
              <i
                className="fa-solid fa-sort"
                onClick={() => handleSort("volumeUsd24Hr")}
              ></i>
            </th>
            <th id="change">
              Change (24h){" "}
              <i
                className="fa-solid fa-sort"
                onClick={() => handleSort("changePercent24Hr")}
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCryptos.map((crypto: ICurrency) => (
            <tr key={crypto.id}>
              <td>{crypto.rank}</td>
              <td id="name">
                <img
                  src={`src/assets/icons/${crypto.symbol}.png`}
                  alt={crypto.symbol}
                  onError={(e) => {
                    e.currentTarget.src = "https://unsplash.it/32/32";
                  }}
                />{" "}
                {crypto.name}
              </td>
              <td>{crypto.symbol}</td>
              <td>{formatPrice(Number(crypto.priceUsd))}</td>
              <td id="marketCap">{formatNumber(Number(crypto.marketCapUsd))}</td>
              <td>{formatNumber(Number(crypto.volumeUsd24Hr))}</td>
              <td
                style={{
                  color:
                    parseFloat(crypto.changePercent24Hr) < 0
                      ? "red"
                      : "#00ff1b",
                }}
              >
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoCoins;
