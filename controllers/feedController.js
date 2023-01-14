exports.getPost = (req, res, next) => {
  res.status(200).json({
    title: "feed1",
    content: "content: feed1",
    createdBy: "Sree",
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const createdBy = req.body.createdBy;
  const id = Math.random();

  res.status(201).json({
    id: id,
    title: title,
    content: content,
    createdBy: createdBy,
  });
};
