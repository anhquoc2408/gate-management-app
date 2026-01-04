const Vehicle = require('./models/Vehicle');
const vehicleRoutes = require('./routes/vehicle.routes');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
  res.send('Gate Management API is running');
});

// 🔹 Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connected successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to MySQL:', err);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
