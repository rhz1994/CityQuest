// routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Hämtar användarprofil baserat på användar-ID
router.get("/:id", usersController.getUserProfile);

// Skapar en ny användare
router.post("/", usersController.createUser);

// Uppdaterar en användare (PUT)
router.put("/:id", usersController.updateUser);

// Tar bort en användare (DELETE)
router.delete("/:id", usersController.deleteUser);

// Uppdaterar specifika fält för en användare (PATCH)
router.patch("/:id", usersController.patchUser);

module.exports = router;
