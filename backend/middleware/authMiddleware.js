import pkg from "jsonwebtoken";
const { sign, verify, JsonWebTokenError, TokenExpiredError } = pkg;

import User from "../models/User.js";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token" });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ error: "User not found" });
        }

        next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid token" });
        }

        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ error: "Token expired" });
        }

        next(error);
    }
};

export default protect;
