import React, { useRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useInView } from 'react-intersection-observer';
import { GridBackgroundDemo } from './ui/GridDemo';
Chart.register(...registerables);

const data = {
  labels: [
    'Pre Sale',
    'Pre ICO Sale',
    'ICO',
    'Team',
    'Long-Term Treasury Fund (LTF)',
    'Ecosystem and Community (SGF)',
    'Marketing and Operation',
    'Advisors',
    'Launchpad',
    'Testnet Airdrop',
    'Mainnet Airdrop',
  ],
  datasets: [
    {
      label: 'Token Distribution',
      data: [
        500000000,
        1000000000,
        1000000000,
        2000000000,
        2000000000,
        1500000000,
        400000000,
        500000000,
        300000000,
        100000000,
        200000000,
      ],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#FF9F40',
        '#4BC0C0',
        '#9966FF',
        '#C9CBCF',
        '#36A2EB',
        '#FFCE56',
        '#FF6384',
        '#FF9F40',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#FF9F40',
        '#4BC0C0',
        '#9966FF',
        '#C9CBCF',
        '#36A2EB',
        '#FFCE56',
        '#FF6384',
        '#FF9F40',
      ],
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        font: {
          size: 14,
        },
        color: '#ffffff',
        boxWidth: 20,
        padding: 20,
      },
    },
  },
  maintainAspectRatio: false,
};

const ProgressBar = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span>{label}</span>
      <span>{value.toLocaleString('en-US')}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className="h-full transition-all duration-500 ease-in-out"
        style={{ width: `${(value / 10000000000) * 100}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

const Tokenomics = () => {
  const { ref: chartRef, inView: chartInView } = useInView({
    threshold: 0.1,
    triggerOnce: false, // Set to false to trigger multiple times
  });
  const { ref: barsRef, inView: barsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false, // Set to false to trigger multiple times
  });

  return (
    <section id="tokenomics" className="relative py-12 bg-gray-900 text-white overflow-hidden">
      <GridBackgroundDemo />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#DFC03E]">Tokenomics</h2>
          <p className="text-lg leading-relaxed">
            Discover the distribution and key metrics of our token. Transparency and clarity are at the heart of our project.
          </p>
        </div>
        <div className="flex justify-center items-center flex-wrap lg:flex-nowrap">
          <div
            className={`w-full lg:w-1/2 h-[500px] mb-8 lg:mb-0 transition-all duration-700 ${chartInView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
            ref={chartRef}
          >
            <Pie data={data} options={options} />
          </div>
          <div
            className={`w-full lg:w-1/2 lg:pl-12 transition-all duration-700 ${barsInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            ref={barsRef}
          >
            {data.labels.map((label, index) => (
              <ProgressBar
                key={label}
                label={label}
                value={data.datasets[0].data[index]}
                color={data.datasets[0].backgroundColor[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
