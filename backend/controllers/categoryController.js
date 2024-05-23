const prisma = require("../utils/prismaClient");
const slugify = require("slugify");

class CateogryController {
  /**
   * METHOD: GET
   * API: /api/v1/categories
   */
  static async index(_, res) {
    try {
      const cats = await prisma.category.findMany({
        include: {
          subcategories: true,
        },
      });
      res.status(200).json(cats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   * METHOD: POST
   * API: /api/v1/questions
   */
  static async store(req, res) {
    const { name } = req.body;
    try {
      if (!name) return res.status(400).json({ error: "Name is required" });

      const category = await prisma.category.create({
        data: {
          name,
        },
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Failt to store category" });
    }
  }
  /**
   *
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { name },
      });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  /**
   *
   */
  static async delete(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Category ID is required" });
    try {
      await prisma.category.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Fail to delete category" });
    }
  }
  /**
   * METHOD: GET
   * API: /api/v1/categories/:id
   */
  static async show(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Category ID is required" });
    try {
      const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: {
          subcategories: true,
        },
      });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = CateogryController;
