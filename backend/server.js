// store-rating-system/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./models');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/stores', require('./routes/store.routes'));
app.use('/api/ratings', require('./routes/rating.routes'));
app.use('/api/user', require('./routes/user.routes'));

// Sync DB and start server
db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
});
