export const authorizationMiddleware = ([roles]) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
