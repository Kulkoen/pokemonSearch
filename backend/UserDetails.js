const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema(
	{
		name: String,
		type: String,
	},
	{
		collection: "Pokemon",
	}
);

// Define a schema for user details
const UserDetailSchema = new mongoose.Schema(
	{
		// Fields for user
		name: String,
		email: { type: String, unique: true },
		password: String,
		team: [PokemonSchema],
	},
	{
		// Collection for user information
		collection: "UserInfo",
	}
);

// Create a model for user details using the schema
mongoose.model("UserInfo", UserDetailSchema);
