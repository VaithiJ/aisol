import React, { useEffect, useRef, useState } from 'react';
import { GridBackgroundDemo } from './ui/GridDemo';

const Why = () => {
  const [isInView, setIsInView] = useState(false);
  const whyRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (whyRef.current) {
      observer.observe(whyRef.current);
    }

    return () => {
      if (whyRef.current) {
        observer.unobserve(whyRef.current);
      }
    };
  }, []);

  return (
    <div id="why" className="relative py-12 bg-gray-900 text-white overflow-hidden" ref={whyRef}>
      <GridBackgroundDemo />
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transition-opacity duration-1000 ease-in-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <h3 className="text-3xl font-extrabold mb-6 text-[#DFC03E]">Why Roll with Us?</h3>
          <p className="text-lg leading-relaxed mx-auto max-w-2xl mb-10">
            Our squad is packed with degen pros who know the blockchain trenches inside out. We provide all the deets on PumpFun tokens, from socials to holders, token owners' history, and more.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {[
            {
              image: '/icon1.jpg',
              title: 'Comprehensive Token Scans',
              description: 'Get the full scoop on PumpFun tokens, including socials, holders, token owners’ history, and other crucial details.'
            },
            {
              image: '/icon2.jpg',
              title: 'Real-Time Wallet Tracking',
              description: 'Our wallet tracker lets you copy trade like a pro, keeping you ahead of the game and in the know.'
            },
            {
              image: '/icon3.jpg',
              title: 'Advanced Threat Detection',
              description: 'We use global intel feeds and advanced AI to spot sketchy transactions and emerging threats, keeping you ahead of the game.'
            },
            {
              image: '/icon4.jpg',
              title: 'Decentralized Fort Knox',
              description: 'We leverage blockchain tech to build a decentralized, transparent, and resilient security setup, ensuring your Dapp is rock-solid.'
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`relative p-2 rounded-lg text-center hover:shadow-xl transition-all duration-1000 ease-in-out delay-${index * 150}ms ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            >
              <div
                className="relative bg-cover bg-center bg-no-repeat h-64 rounded-lg"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <p className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-sm leading-relaxed opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
                  {item.description}
                </p>
              </div>
              <h4 className="text-xl font-bold mt-4 relative text-[#DFC03E]">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Why;
