import host from 'ip';

import './LoggingInitialization';
import Speller from './Speller';

const speller = new Speller();
const port = 5000;
const address = host.address();

speller.run(port, address);
