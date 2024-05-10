const prisma = require("../utils/prismaClient");
const slugify = require("slugify");

class SubCategoryController {
  /**
   *
   */
  static async store(req, res) {
    try {
      const { name, categoryId } = req.body;
      const createSubcategory = await prisma.subcategory.create({
        data: {
          name,
          categoryId,
        },
      });
      res.status(201).json(createSubcategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   *
   */
  static async index(_, res) {
    try {
      const subcategories = await prisma.subcategory.findMany({
        include: {
          category: true,
        },
      });
      res.status(200).json(subcategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   *
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, categoryId } = req.body;
      const subcategory = await prisma.subcategory.update({
        where: { id: parseInt(id) },
        data: { name, categoryId },
      });
      res.status(200).json(subcategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   *
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.subcategory.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = SubCategoryController;
