import { setupServer } from 'msw/node';
import { handlers } from '@web/test/msw/handlers';

export const server = setupServer(...handlers);
