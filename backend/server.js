require('dotenv').config();
const app = require('./src/app');
const initDatabase = require('./src/init-db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();