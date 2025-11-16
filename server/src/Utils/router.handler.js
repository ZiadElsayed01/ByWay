const routerHandler = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello in ByWay project!");
  });

  app.all(/.*/, (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
};

export default routerHandler;
