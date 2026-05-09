const bcrypt = require("bcryptjs");

bcrypt.hash("demo123", 10).then(console.log);