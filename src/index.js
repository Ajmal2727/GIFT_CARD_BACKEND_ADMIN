import 'dotenv/config.js';
import connectToDB from './config/index.js';
import app from './app.js';

// dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`⚙️ server started on port http://localhost:${PORT}`);

  })
}).catch((err) => {
  console.log(`error on starting MongoDB`, err);

})

