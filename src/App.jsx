import React, { useState, useEffect } from 'react';

const calculatePiDigits = (piText, digits) => {
  const piDigits = piText.replace('.', '').slice(0, digits); 
  const count = Array(10).fill(0); 

  for (let i = 0; i < piDigits.length; i++) {
    const digit = parseInt(piDigits[i], 10); 
    count[digit] += 1;
  }

  return count;
};

async function fetchPiText() {
  const response = await fetch('/pi.txt');
  return response.text();
}

export default function App() {
  const [digits, setDigits] = useState(3);
  const [piText, setPiText] = useState(''); 
  const [chartUrl, setChartUrl] = useState(''); 
  
  useEffect(() => {
    (async () => {
      const newText = await fetchPiText();
      setPiText(newText);
    })();
  },[]);

  useEffect(() => {
    const count = calculatePiDigits(piText, digits); 
    const width = Math.min(Math.round(window.innerWidth * 0.8), 800); 
    const height = width/2; 

    const chartUrl = `https://image-charts.com/chart?cht=bvs&chs=${width}x${height}&chd=t:${count.join(',')}&chxt=x,y&chxl=0:|0|1|2|3|4|5|6|7|8|9|&chtt=Digit+Occurrences+in+Pi+Digits+(${digits}+digits)&chm=N,000000,0,-1,15&chco=87CEFA`;
    setChartUrl(chartUrl);
  }, [piText, digits]);

  const handleChange = (e) => {
    const newDigits = Math.max(1, parseInt(e.target.value, 10));
    setDigits(newDigits);
  };

  let displayDigits = 0;
  if(digits >= 1) {
    displayDigits = digits;
  }

  const displayPi = piText.slice(2, 1 + digits);

  let piDisplay = '';
  if(digits === 1){
    piDisplay = '3';
  }else if(digits >= 2){
    piDisplay = '3.' + displayPi;
  }
    
  return (
    <div>
      <header>
        <h1>Pi Digits Frequency</h1>
      </header>
      <main>
        <label>
          Enter number of digits of Pi:
          <input 
            type="number" value={digits} onChange={handleChange} 
            min="1" max="800" 
          />
        </label>

        <img src={chartUrl} alt="Pi Digits Frequency Chart" />

        <h2>Pi Digits (up to {displayDigits} digits)</h2>
        <p>{piDisplay}</p> 
      </main>
      <footer>
        <h3>
          日本大学文理学部情報科学科 Webプログラミングの演習課題 <br/>
          0123104 橋本歩武
        </h3>
      </footer>
    </div>
  );
}
