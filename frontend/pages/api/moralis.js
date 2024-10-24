import Moralis from 'moralis';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = MORALIS_KEY;
let isMoralisStarted = false;

export const startMoralis = async () => {
  if (!isMoralisStarted) {
    await Moralis.start({ apiKey });
    isMoralisStarted = true;
  }
};

export default Moralis;
