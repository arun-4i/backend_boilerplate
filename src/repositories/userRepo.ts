import { User, UserCreationAttributes } from "../models/user";
import { logger } from "../utils/logger";
import { UniqueConstraintError } from "sequelize";

export class UserRepository {
  async createUser(userData: UserCreationAttributes): Promise<User> {
    try {
      const user = await User.create(userData);
      logger.info("db", "User created in DB", {
        userId: user.id,
        email: user.email,
      });
      return user;
    } catch (error: any) {
      logger.error("db", "Error creating user in DB", { error });
      if (error instanceof UniqueConstraintError) {
        throw new Error("USER_EMAIL_ALREADY_EXISTS");
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }
}
