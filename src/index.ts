import host from 'ip';

import './LoggingInitialization';
import SpellerService from './SpellerService';

const speller = new SpellerService();
const port = 5000;
const address = host.address();

const server = speller.run(port, address);

// NOTE(KE): for testing
export default server;
