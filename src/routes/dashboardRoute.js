const router = require("express").Router();
const commentController = require("../controllers/commentController");


router.get("/dashboard", commentController.getbyPostId);

module.exports = router;
