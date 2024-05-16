const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 3000;
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define schema and model for user1 collection
const user1Schema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true }
});

const User1 = mongoose.model("User1", user1Schema);

// Define schema and model for user2 collection
const user2Schema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true }
});

const User2 = mongoose.model("User2", user2Schema);

// Schema for adding the purchasing product
const userPurchaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true }
});

const User1purchase = mongoose.model("User1purchase", userPurchaseSchema);
const User2purchase = mongoose.model("User2purchase", userPurchaseSchema);

app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${JSON.stringify(req.body)}`);
  next();
});

// Route to add data to user1 collection
app.post("/api/user1", async (req, res) => {
  const { title, amount } = req.body;
  const newData = new User1({ title, amount });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get data from user1 collection
app.get("/api/user1", async (req, res) => {
  try {
    const userData = await User1.find();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add data to user2 collection
app.post("/api/user2", async (req, res) => {
  const { title, amount } = req.body;
  const newData = new User2({ title, amount });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Route to get data from user2 collection
app.get("/api/user2", async (req, res) => {
  try {
    const userData = await User2.find();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add data of the user1 purchase
app.post("/api/user1purchase", async (req, res) => {
  const { title, amount } = req.body;
  const newData = new User1purchase({ title, amount });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    console.error("Error:", err); // Logging error for debugging
    res.status(400).json({ message: err.message });
  }
});

// Route to add data of the user2 purchase
app.post("/api/user2purchase", async (req, res) => {
  const { title, amount } = req.body;
  const newData = new User2purchase({ title, amount });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    console.error("Error:", err); // Logging error for debugging
    res.status(400).json({ message: err.message });
  }
});

// Route to get data of the user1 purchase
app.get("/api/user1purchase", async (req, res) => {
  try {
    const userData = await User1purchase.find();
    res.status(200).json(userData);
  } catch (err) {
    console.error("Error:", err); // Logging error for debugging
    res.status(500).json({ message: err.message });
  }
});

// Route to get data of the user2 purchase
app.get("/api/user2purchase", async (req, res) => {
  try {
    const userData = await User2purchase.find();
    res.status(200).json(userData);
  } catch (err) {
    console.error("Error:", err); // Logging error for debugging
    res.status(500).json({ message: err.message });
  }
});

// Route to delete an item from user1 collection
app.delete("/api/user1/:id", async (req, res) => {
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







app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
