// Campus rep users for GET /api/admin/users only (per-team demo data).
// Pending review items and dashboard counts come from MongoDB (see adminController).

const campusRepUsers = [
  { id: "u-1", name: "Alice Nguyen", email: "alice@nyu.edu", campus: "NYU", role: "campus_rep" },
  { id: "u-2", name: "Ben Okafor", email: "ben@tulsa.edu", campus: "Tulsa University", role: "campus_rep" },
  { id: "u-3", name: "Chloe Park", email: "chloe@nyu.edu", campus: "NYU", role: "campus_rep" },
];

module.exports = { campusRepUsers };
