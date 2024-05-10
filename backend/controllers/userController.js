const prisma = require("../utils/prismaClient");

class UserController {
  /**
   *  METHOD: GET
   * API: /api/v1/users
   */
  static async index(_, res) {
    try {
      let users = await prisma.user.findMany();
      // Remove the password field from each user object
      users = users.map((user) => {
        delete user.password;
        return user;
      });
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error getting all users" });
    }
  }

  /**
   *  METHOD: DELETE
   * API: /api/v1/users/:id
   */
  static async delete(req, res) {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "User ID not found!" });
    try {
      let isUser = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!isUser) return res.status(404).json({ message: "User not found!" });

      await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });
    }
  }
}

module.exports = UserController;
