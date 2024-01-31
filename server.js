require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
const JWT_SECRET =
	"skdqjn2eurbj5kss46dh096234bw6igpwd[wogh9uinzmzxnjuh232whrf928]";

app.use(express.json());

// Connect to the MongoDB database using mongoose
mongoose
	.connect(process.env.MONGODB_URI)
	// .connect(mongoURL)
	.then(() => {
		// If the connection is successful
		console.log("Database Connected");
	})
	.catch((e) => {
		// If the connection fails, log the error
		console.log(e);
	});

// Import the user details schema and model
require("./UserDetails");
const User = mongoose.model("UserInfo");

// Define a GET route for the '/' endpoint
app.get("/", (req, res) => {
	res.send("Hello from the backend");
});

// Define a POST route for the '/register' endpoint
app.post("/register", async (req, res) => {
	// Get the name, email, and password from the request body
	const { name, email, password } = req.body;

	// Check if there is already a user with the same email
	const oldUser = await User.findOne({ email: email });

	// If yes, send a response with a message
	if (oldUser) {
		return res.send({ data: "User already exist" });
	}
	const ecryptedPassword = await bcrypt.hash(password, 10);
	try {
		// If no, create a new user with the given details
		await User.create({
			name: name,
			email: email,
			password: ecryptedPassword,
		});
		res.send({ status: "OK", data: "User Created" });
	} catch (error) {
		res.send({ status: "ERROR", error: error });
	}
});

app.post("/login-user", async (req, res) => {
	const { email, password } = req.body;
	const oldUser = await User.findOne({ email: email });

	if (!oldUser) {
		return res.send({ data: "User does not exist" });
	}

	if (await bcrypt.compare(password, oldUser.password)) {
		const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);

		if (res.status(201)) {
			return res.send({ status: "OK", data: token });
		} else {
			return res.send({ error: "ERROR" });
		}
	}
});

// Start the server and listen on the port
app.listen(port, () => {
	console.log(`Server has started ${port}`);
});
