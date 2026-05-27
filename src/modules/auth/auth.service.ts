import { pool } from "../../db";
import bcrypt from "bcryptjs";
import jwt , {type jwtPayload } from "jsonwebtoken"
import config from "../../config";

const loginUserIntoDB = async (payload: {
    email: string;
    password: string;
}) => {

    const { email, password } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]
    );

    if (userData.rows.length === 0) {
        throw new Error("Invalid Credential");

    }

    const user = userData.rows[0];

    const correctPassword = await bcrypt.compare(password, user.password);

    if(!correctPassword){
        throw new Error("Invalid Password");
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const token = jwt.sign(jwtpayload, config.secret as string, {expiresIn: "1d"});

    delete user.password;
    console.log("From auth.service",user);

    return {token, user};
}

export const authService ={
    loginUserIntoDB,
}