import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { userService } from "../services/userService";
import { createUserSchema } from "../validators/userValidator";
import { logger } from "@utils/logger";

export class UserController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        logger.warn("userAction", "Validation failed for register", {
          errors: parsed.error.errors,
        });
        res.status(400).json({
          success: false,
          message: "Validation error",
          error: {
            code: "VALIDATION_ERROR",
            details: parsed.error.errors,
          },
        });
        return;
      }

      const user = await userService.createUser(parsed.data);
      logger.info("userAction", "User registered", {
        userId: user.id,
        email: user.email,
      });
      const jwtOptions: jwt.SignOptions = {};
      if (config.JWT_EXPIRES_IN) {
        jwtOptions.expiresIn = config.JWT_EXPIRES_IN as any;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        jwtOptions
      );
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          token,
        },
      });
    } catch (error: any) {
      if (error.code === "USER_EMAIL_ALREADY_EXISTS") {
        logger.warn("userAction", "Attempt to register with existing email", {
          email: req.body.email,
        });
        res.status(409).json({
          success: false,
          message: "Email already exists",
          error: {
            code: "USER_EMAIL_ALREADY_EXISTS",
          },
        });
        return;
      }
      logger.error("userAction", "Error registering user", { error });
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const user = await userService.findByEmail(email);
      if (!user?.isActive) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const jwtOptions: jwt.SignOptions = {};
      if (config.JWT_EXPIRES_IN) {
        jwtOptions.expiresIn = config.JWT_EXPIRES_IN as any;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        jwtOptions
      );
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const userController = new UserController();
