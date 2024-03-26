const express = require("express");
const router = express.Router();


const { getAllUser, deleteUser } = require("../controllers/users");

require("../db/conn");

router.get("/users", getAllUser);
router.delete("/users/:id", deleteUser);
module.exports = router;
