import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    // Fetch data using async/await
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        return response;// we could directly get result from await response.json()  ..... instead of returning response
        // const result = await response.json(); 
        // setData(result);
        // setFilteredData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const result = fetchData();
    result.then((res) => res.json()).then((data) => {
      setData(data);
      setFilteredData(data);
      console.log(data);
    }).catch((err) => console.log(err));
    // Fetch data using .then
    // fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
    //   .then(response => response.json())
    //   .then(result => {
    //     setData(result);
    //     setFilteredData(result);
    //   })
    //   .catch(error => console.error('Error fetching data:', error));
  }, []);


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchWord = e.target.value.toLowerCase();
    const newFilteredData = data.filter(item => 
      item.name.toLowerCase().includes(searchWord) || 
      item.symbol.toLowerCase().includes(searchWord)
    );
    setFilteredData(newFilteredData);
  };

  const handleSort = (type) => {
    const newData = [...filteredData]; // Create a shallow copy of the data
    
    if (type === 'marketCap') {
      newData.sort((a, b) => a.market_cap - b.market_cap);
    } else if (type === 'percentage') {
      newData.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    }
    console.log("working");
    setFilteredData(newData); // Update the state with the sorted data
  };

  
  return (
    <div className="mainDiv">
      <div className="pt-5 w-60">
        <div className="d-flex" style={{ gap: '15px' }}>
          <div className="inp">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              className="custom-placeholder"
              id="input"
              type="text"
              placeholder="Search By Name or Symbol"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="btns" onClick={() => handleSort('marketCap')}>Sort By Mkt Cap</button>
          <button className="btns" onClick={() => handleSort('percentage')}>Sort By Percentage</button>
        </div>
        <table className="mt-4" id="data-table">
          <tbody id="t-body">
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="divImgPara">
                    <img src={item.image} alt={item.name} className="image" />
                    <p className="imagePara">{item.name}</p>
                  </div>
                </td>
                <td className="pl-6 pr-5 mediaQuery-2">{item.symbol.toUpperCase()}</td>
                <td className="text-right">${item.current_price}</td>
                <td className="text-right pr-5 mediaQuery">${item.total_volume.toLocaleString()}</td>
                <td className="text-right pl-3 pr-1">
                  <span className={item.price_change_percentage_24h > 0 ? "profit" : "loss"}>
                    {item.price_change_percentage_24h.toFixed(2)}%
                  </span>
                  <i className={item.price_change_percentage_24h > 0 ? "fa-solid fa-arrow-trend-up profit" : "fa-solid fa-arrow-trend-down loss"} style={{ paddingLeft: '6px' }}></i>
                </td>
                <td className="text-center mediaQuery">MktCap : ${item.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
