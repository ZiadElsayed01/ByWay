export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
};

export const USER_TYPES = [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR];
export const USER_ROLES_TYPES = [USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN];

export const LANGUAGE_TYPES = {
  EN: "en",
  AR: "ar",
};

export const COURSE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_METHODS = {
  VISA: "visa",
  PAYPAL: "paypal",
  WALLET: "wallet",
  COD: "cod",
};

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
};

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
export const VIDEO_TYPES = ["video/mp4"];
