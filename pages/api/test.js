export default function handler(req, res) {
  if (req.method === "GET") {
    res
      .status(200)
      .json({
        message: "Test route is working!",
        time: new Date().toISOString(),
      });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
