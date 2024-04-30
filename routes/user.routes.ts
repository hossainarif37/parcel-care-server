import express from "express"
import { getCurrentUser } from "../controllers/user.controller";
import { checkAuth } from "../middleware/authorization";
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



export default router;