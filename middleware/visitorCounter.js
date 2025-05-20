const visitCounts = {}; // In-memory count
const visitorCounter = (req, res, next) => {
  const productId = req.params.id;

  if (visitCounts[productId]) {
    visitCounts[productId]++;
  } else {
    visitCounts[productId] = 1;
  }

  // Attach visit count to the request object
  req.visitCount = visitCounts[productId];

  next();
};
module.exports = { visitorCounter };
