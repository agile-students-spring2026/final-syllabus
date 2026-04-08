const getHomepage = (req, res) => {
  res.json({ message: "Welcome to the homepage!" });
};

module.exports = { getHomepage };
