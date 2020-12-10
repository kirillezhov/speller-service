import host from 'ip';

import './LoggingInitialization';
import Speller from './Speller';

const PORT = 5000;
const ADDRESS = host.address();
const speller = new Speller();

speller.run(PORT, ADDRESS);
