import categoryModel from "../../../DB/Models/categories.model.js";

export const createCategory = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({
      message: "Name and slug are required",
    });
  }

  const category = await categoryModel.create({ name, slug });

  return res.status(201).json({
    message: "Category created successfully",
    category,
  });
};

export const getAllCategories = async (req, res) => {
  const categories = await categoryModel.find().select("name slug");

  return res.status(200).json({
    message: "Categories fetched successfully",
    categories,
  });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const deletedCategory = await categoryModel.findByIdAndDelete(id);
  if (!deletedCategory) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  return res.status(200).json({
    message: "Category deleted successfully",
  });
};
