import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";


const signupUser = async (payload: IUser) => {
    const { name, email, password, role } = payload;

    const existingUser = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
      INSERT INTO users(name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING id,name,email,role,created_at,updated_at
    `,
        [name, email, hashedPassword, role || "contributor"]
    );

    return result.rows[0];
};

export const authService = {
    signupUser,
};