import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false, // http -> false, https -> true /in production its true
      httpOnly: true, // to prevent xss attack
      sameSite: "lax", // "none", "strict", "Lax"-> CSRF
      //maxAge:
      path: "/",
      domain: "localhost",
    });

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

// ? refresh-token route
const generateToken = async (req: Request, res: Response) => {
  try {
    //console.log(req.cookies.refreshToken);
    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );

    res.status(200).json({
      success: true,
      message: "Access Token Generated  Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
