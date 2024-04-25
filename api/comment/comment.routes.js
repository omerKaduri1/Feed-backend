import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getComments, getCommentById, addComment, updateComment, removeComment } from './comment.controller.js'

const router = express.Router()

router.get('/', log, getComments)
router.get('/:id', getCommentById)
router.post('/', addComment)
router.put('/:id', updateComment)
router.delete('/:id', removeComment)

export const commentRoutes = router
