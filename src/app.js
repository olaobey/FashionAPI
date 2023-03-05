const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { sanitizer } = require("./middleware/sanitizer");
// const { csrfProtection, attachCSRF } = require("./utils/csrf");
const cookieParser = require("cookie-parser");
const AuthRouter = require("./routes/authRoutes");

// Importing Account Routes
const Account_addressRouter = require("./routes/account/address");
const Account_indexRouter = require("./routes/account/index");
const Account_orderRouter = require("./routes/account/orders");
const Account_paymentRouter = require("./routes/account/payment");

// Importing Checkout Routes
const Checkout_authRouter = require("./routes/checkout/auth");
const Checkout_indexRouter = require("./routes/checkout/index");
const Checkout_orderRouter = require("./routes/checkout/order");
const Checkout_paymentRouter = require("./routes/checkout/payment");
const Checkout_shippingRouter = require("./routes/checkout/shipping");

// Importing Shop Routes
const Shop_cartRouter = require("./routes/shop/cart");
const Shop_cartItemRouter = require("./routes/shop/cartItem");
const Shop_productRouter = require("./routes/shop/product");

const pool = require("./db/config");
const dotenv = require("dotenv");
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

const app = express();

const customLogger = (message) => (req, res, next) => {
  console.log(`Hello from ${message}`);
  next();
};

// Configuring dotenv
dotenv.config();

// Middleware Configuration for parse request body and cookies
app.use(express.json());

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(customLogger("custom-logger"));

app.use(cookieParser());

app.use(cors(corsOptions));

// have all routes attach a CSRF token
// app.all("*", attachCSRF);

// trust first proxy for session cookie secure
app.set("trust proxy", 1);

// protect routes from CSRF attacks
// app.use(csrfProtection);

// helmet for added security on http headers
app.use(helmet());

// custom middleware to sanitize user inputs
app.use(sanitizer);

// Authentication routes
app.use("/api/v1", AuthRouter);

// Account Endpoints
app.use("/api/v1/address", Account_addressRouter);

app.use("/api/v1/account", Account_indexRouter);

app.use("/api/v1/orders", Account_orderRouter);

app.use("/api/v1/payment", Account_paymentRouter);

// Checkout Endpoints
app.use("/api/v1/order", Checkout_orderRouter);

app.use("/api/v1/auth", Checkout_authRouter);

app.use("/api/v1/checkout", Checkout_indexRouter);

app.use("/api/v1/payment", Checkout_paymentRouter);

app.use("/api/v1/shipping", Checkout_shippingRouter);

// Shop Endpoints
app.use("/api/v1/cart", Shop_cartRouter);

app.use("/api/v1/items", Shop_cartItemRouter);

app.use("/api/v1/products", Shop_productRouter);

// Add custom error-handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json(err.message);
});

// enable session for persistent cart
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "development",
      httpOnly: true,
    },
  })
);

// custom error-handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json(err.message);
});

module.exports = app;
