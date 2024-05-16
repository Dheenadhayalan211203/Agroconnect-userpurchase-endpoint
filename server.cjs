const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const User1 = require('./models/User1'); // Ensure the correct path to your model file

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Route to get data from user1 collection
app.get('/api/user1', async (req, res) => {
  try {
    const userData = await User1.find();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add data to user1 collection
app.post('/api/user1', async (req, res) => {
  const { title, amount } = req.body;
  const newData = new User1({ title, amount });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete data from user1 collection
app.delete('/api/user1/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Attempting to delete product with ID: ${id}`); // Log the ID being deleted

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deletedProduct = await User1.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error in deleting product:", err); // More detailed logging
    res.status(500).json({ message: "Error in deleting cart item" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
