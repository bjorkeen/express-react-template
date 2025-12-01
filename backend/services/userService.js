const mongoUserService = require('./userService.mongo');
const memoryUserService = require('./userService.memory');

const useMongo = process.env.USE_MONGO === 'true';

module.exports = useMongo ? mongoUserService : memoryUserService;
