import * as realAuth from './auth';
import * as mockAuth from './mock/auth.mock';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const authApi = useMock ? mockAuth : realAuth;
