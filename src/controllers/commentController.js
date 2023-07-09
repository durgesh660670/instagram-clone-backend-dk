const Comment = require("../Models/commentModel");
const Article = require("../Models/articleModel");
const {customLogger}=require("../middleware/logger");

const addComment = async (req, res) => {
  try {
    const { articleId, ...comment } = req.body;
    comment.user = req.user._id;
    const commenttosave = new Comment(comment);
    const savedcomment = await commenttosave.save();
    await Article.findOneAndUpdate(
      { _id: articleId },
      { $push: { comment: savedcomment._id } }
    );
    res.status(200).send({
      status: "success",
      message: "Comment has been created",
    });
  } catch (e) {
    customLogger.info("addComment catch - "+e.stack)
    res.status(500).send({
      status: "failure",
      message: "Error while adding comment",
    });
  }
};
const getbyPostId = async (req, res) => {
  const ArticleId = req.params.ArticleId;
  try {
    const article = await Article.findOne({ _id: ArticleId }).populate(
      "comment"
    );
    res.status(200).send({
      status: "success",
      comments: article.comment,
    });
  } catch (error) {
    customLogger.info("getbyPostId catch - "+e.stack)
    res.status(500).send({
      status: "failure",
      message: "Error while get by PostId",
    });
  }
};

module.exports = { addComment, getbyPostId };

