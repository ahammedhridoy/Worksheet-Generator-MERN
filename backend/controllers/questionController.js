const prisma = require("../utils/prismaClient");
const { uniqueID } = require("dev-unique-id");
const path = require("path");

class QuestionController {
  /**
   * METHOD: GET
   * API: /api/v1/questions
   */
  static async index(_, res) {
    try {
      const questions = await prisma.questions.findMany({
        include: {
          category: true,
          subcategory: true,
        },
      });
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  /**
   * METHOD: POST
   * API: /api/v1/questions
   */
  static async store(req, res) {
    const {
      question,
      answer,
      solution,
      categoryId,
      subcategoryId,
      filterlevel,
    } = req.body;
    const filename = req?.file?.filename;
    const fileUrl = path.join(filename);
    const catid = parseInt(categoryId);
    // Validate if all required fields are present
    if (!question || !answer || !solution) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const createQuestion = await prisma.questions.create({
        data: {
          question,
          question_slug: uniqueID(5),
          answer,
          solution,
          categoryId: catid,
          subcategoryId,
          filterlevel,
          image: fileUrl ? fileUrl : null,
        },
      });
      res.status(201).json({
        message: "Question Created Successfully",
        question: createQuestion,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating question" });
    }
  }
  /**
   *
   */
  static async show(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Question ID is required" });
    try {
      const qs = await prisma.questions.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(qs);
    } catch (error) {
      res.status(500).json({ error: "Fail to get single question" });
    }
  }
  /**
   *
   */
  static async update(req, res) {
    const {
      question,
      answer,
      solution,
      categoryId,
      subcategoryId,
      filterlevel,
    } = req.body;
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Question ID is required" });
    try {
      // const qsSlug = slugify(question, { trim: true, lower: true });

      const qs = await prisma.questions.findUnique({
        where: { id: Number(id) },
      });
      if (!qs) return res.status(404).json({ error: "Question not found" });

      const updatedQuestion = await prisma.questions.update({
        where: { id: Number(id) },
        data: {
          question: question || qs.question,
          answer: answer || qs.answer,
          question_slug: uniqueID(5),
          solution: solution || qs.solution,
          categoryId: categoryId || qs.categoryId,
          subcategoryId: subcategoryId || qs.subcategoryId,
          filterlevel: filterlevel || qs.filterlevel,
        },
      });
      res.status(200).json({ messgae: "Question updated", updatedQuestion });
    } catch (error) {
      res
        .status(500)
        .json({ messgae: "Fail to update question (server error)" });
    }
  }
  /**
   *
   */
  static async delete(req, res) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Question ID is required" });

    try {
      await prisma.questions.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: "Question deleted" });
    } catch (error) {
      res.status(500).json({ message: "Fail to delete question" });
    }
  }
}
module.exports = QuestionController;
