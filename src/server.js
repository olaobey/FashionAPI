const dotenv = require("dotenv");
const app = require("./app");
const PORT = process.env.PORT || 5000;

// Configuring dotenv
dotenv.config();

// Home page
app.get("/", (req, res) => {
  return res.status(200).send({
    message:
      "You are welcome to fashion store! Please try to pick products of your choice",
  });
});

//Initialization of Server
app.listen(PORT, () => {
  console.log(`FashionStore server is running at port ${PORT}`);
});
