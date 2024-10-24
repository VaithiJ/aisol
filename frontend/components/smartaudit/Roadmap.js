import React, { useEffect, useRef, useState } from 'react';
import { GridBackgroundDemo } from './ui/GridDemo';

const roadmapData = [
  {
    quarter: 'Q1 2024',
    milestones: [
      'Project Initiation',
      'Team Formation',
      'Initial Research and Planning',
    ],
  },
  {
    quarter: 'Q2 2024',
    milestones: [
      'Whitepaper Release',
      'Website Launch',
      'Smart Contract Development',
    ],
  },
  {
    quarter: 'Q3 2024',
    milestones: [
      'Private Sale',
      'Public Sale',
      'Initial Exchange Offering (IEO)',
    ],
  },
  {
    quarter: 'Q4 2024',
    milestones: [
      'Mainnet Launch',
      'Partnership Announcements',
      'First dApp Deployment',
    ],
  },
];

const Roadmap = () => {
  const [inViewIndices, setInViewIndices] = useState([]);
  const roadmapRef = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInViewIndices(prev => [...prev, entry.target.dataset.index]);
          } else {
            setInViewIndices(prev => prev.filter(index => index !== entry.target.dataset.index));
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    roadmapRef.current.forEach(el => observer.observe(el));

    return () => {
      roadmapRef.current.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="roadmap" className="relative py-16 bg-gray-900 text-white overflow-hidden">
      <GridBackgroundDemo />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-[#DFC03E]">Roadmap</h2>
          <p className="text-xl leading-relaxed">
            Our roadmap outlines our planned milestones and key achievements as we build and grow our blockchain dApp ecosystem.
          </p>
        </div>
        <div className="relative">
          <div className="border-l-4 border-orange-500 absolute h-full left-1/2 transform -translate-x-1/2"></div>
          <div className="space-y-16">
            {roadmapData.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center justify-center ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                ref={el => (roadmapRef.current[index] = el)}
                data-index={index}
              >
                <div
                  className={`relative w-full lg:w-5/12 p-6 transition-transform duration-1000 ${
                    inViewIndices.includes(index.toString())
                      ? index % 2 === 0
                        ? 'transform translate-x-0'
                        : 'transform translate-x-0'
                      : index % 2 === 0
                      ? 'transform -translate-x-full'
                      : 'transform translate-x-full'
                  }`}
                >
                  <div
                    className={`bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 ${
                      index % 2 === 0 ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div className={`absolute top-0 ${index % 2 === 0 ? 'left-0 -ml-8' : 'right-0 -mr-8'}`}>
                      <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{entry.quarter}</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {entry.milestones.map((milestone, idx) => (
                        <li key={idx} className="text-lg">
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
