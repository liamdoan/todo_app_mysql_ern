const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/TodoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is up, listening on port ${PORT}`)
});
