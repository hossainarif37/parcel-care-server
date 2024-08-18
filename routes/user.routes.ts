import express from "express"
import { getCurrentUser, getPendingAgents, getUserById, getUsersByRole, updateUserInfo } from "../controllers/user.controller";
import { checkAuth } from "../middleware/authorization";
import { isAdmin } from "../middleware/adminCheck";
const router = express.Router();

router
    //* Get the current user's profile
    //* Route 
    /**
    * @route GET /current-user
    * @description Get if authenticated.
    * @access Private (Requires user authentication)
    */
    //* Middleware
    /**
     * @middleware isAuthenticateUser
     * @description Check if the user is authenticated before allowing access to certain routes.
     * @access Private
    */
    .get('/current-user', checkAuth, getCurrentUser)

    //* Get user by user ID
    /**
    * @route GET /api/users/:userId/profile
    * @description Get a user's profile by ID.
    * @access Public
    * 
    * @params userId - The ID of the user to retrieve the profile for.
    * 
    * @returns {object} - User profile information.
    * 
    * @throws {404} If the user is not found.
    * @throws {500} If there's an internal server error.
    */
    .get('/:userId/profile', checkAuth, getUserById)

    .put('/:userId/profile', checkAuth, updateUserInfo)

    .get('/', checkAuth, isAdmin, getUsersByRole)

    .get('/pending-agents', checkAuth, isAdmin, getPendingAgents)



export default router;