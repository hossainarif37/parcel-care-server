import express from "express"
import { loginUser, registerUser, updatePassword } from "../controllers/auth.controller";
import { checkAuth } from "../middleware/authorization";
const router = express.Router();

router
    //* User Registration Route
    /**
     * @route POST /api/auth/register
     * @description Register a new user.
     * @access Public
     * 
     * @params name, email, password
     * 
     * @returns {object} - Registration status and message
     * 
     * @throws {409} If the user already exist
     * @throws {400} If there are validation errors in the request body
     * @throws {500} If there's an Internal server error
     */
    .post('/register', registerUser)

    //* User Login Route
    /**
     * @route POST /api/auth/login
     * @description User Login.
     * @access Public
     * 
     * @params email, password
     * 
     * @returns {object} - Registration status and message
     * 
     * @throws {400} If there are validation errors in the request body
     * @throws {401} If there are wrong password errors
     * @throws {404} If the user not exist
     */
    .post('/login', loginUser)

    .put('/update-password', checkAuth, updatePassword)

export default router;