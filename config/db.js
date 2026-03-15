import mongoose from "mongoose";

export const connectToDb = async (req, res) => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected successfully to the database");
    })
    .catch((err) => {
      console.log(err);
    });
};