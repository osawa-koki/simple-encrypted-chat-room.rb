import Env from './next.config.js';
const isProd = process.env.NODE_ENV === 'production';

const setting = {
  isProd,
  basePath: Env.basePath,
  apiPath: isProd ? '' : 'http://localhost:8000',
  title: '🎋 simple-encrypted-chat-room.rb 🎋',
  dialogWaitingTime: 3000,
  smallWaitingTime: 10,
};

export default setting;
