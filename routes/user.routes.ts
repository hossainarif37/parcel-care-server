import express from "express"
import { getAgentsByDistrict, getCurrentUser, getPendingAgents, getUserById, getUsersByRole, updateAgentRequestStatus, updateUserInfo } from "../controllers/user.controller";
import { checkAuth } from "../middleware/authorization";
import { isAdmin } from "../middleware/adminCheck";
const router = express.Router();

router
    // Get the current user's profile
    .get('/current-user', checkAuth, getCurrentUser)

    // Get user by user ID
    .get('/:userId/profile', checkAuth, getUserById)

    // Get Agents by district
    .get('/agents', checkAuth, isAdmin, getAgentsByDistrict)

    // Update user info by user ID
    .put('/:userId/profile', checkAuth, updateUserInfo)

    // Get all users by role
    .get('/', checkAuth, isAdmin, getUsersByRole)

    // Get pending agents by role and agentRequestStatus
    .get('/pending-agents', checkAuth, isAdmin, getPendingAgents)

    // Update agent request status
    .put('/:userId/agent-request-status', checkAuth, isAdmin, updateAgentRequestStatus)



export default router;