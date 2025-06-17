import { UserRepository } from "../repositories/userRepo";
import { CreateUserInput } from "../validators/userValidator";
import { User } from "../models/user";

const userRepository = new UserRepository();

export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    try {
      return await userRepository.createUser(input);
    } catch (error: any) {
      if (error.message === "USER_EMAIL_ALREADY_EXISTS") {
        const err = new Error("Email already exists");
        (err as any).code = "USER_EMAIL_ALREADY_EXISTS";
        throw err;
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }

  async getAllUsers(): Promise<User[]> {
    return userRepository.getAllUsers();
  }
}

export const userService = new UserService();
