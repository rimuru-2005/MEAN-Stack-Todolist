require("dotenv").config();
const DB = require('./src/config/db')
const app = require("./src/app");

// connect to db
DB();

// Get the port from env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost/${PORT}`);
});
