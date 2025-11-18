import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from "./Services/categories.service.js";
import { authenticationMiddleware } from "./../../Middlewares/authentication.middleware.js";
import { errorHandlerMiddleware } from "./../../Middlewares/error.handler.middleware.js";
import { authorizationMiddleware } from "./../../Middlewares/authorization.middleware.js";
import { USER_ROLES, USER_ROLES_TYPES } from "./../../Constants/constants.js";

const categoriesRouter = Router();

categoriesRouter.post(
  "/create-category",
  authenticationMiddleware,
  authorizationMiddleware(USER_ROLES.ADMIN),
  errorHandlerMiddleware(createCategory)
);

categoriesRouter.get(
  "/get-all-categories",
  authenticationMiddleware,
  authorizationMiddleware(USER_ROLES_TYPES),
  errorHandlerMiddleware(getAllCategories)
);

categoriesRouter.delete(
  "/delete-category/:id",
  authenticationMiddleware,
  authorizationMiddleware(USER_ROLES.ADMIN),
  errorHandlerMiddleware(deleteCategory)
);

export default categoriesRouter;
