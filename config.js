const PORT = process.env.PORT || 4002;

const DATABASE_URL = process.env.DATABASE_URL ||
  "mysql://shopper:shoppass@localhost:3306/shop"

exports = module.exports = {PORT, DATABASE_URL}