const express = require('express');
const path = require('path');

const app = express();

// Define the port you want your server to run on. Default is 3000.
const PORT = process.env.PORT || 3000;

// Serve static files from your build directory
app.use(express.static(path.join(__dirname, '/'))); // replace 'build' with the directory name where your compiled HTML/CSS/JS files are.

// Serve your app
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
