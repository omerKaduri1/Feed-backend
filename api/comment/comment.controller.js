import { commentService } from './comment.service.js'
import { logger } from '../../services/logger.service.js'
import { userService } from '../user/user.service.js'

export async function getComments(req, res) {
    try {
        logger.debug('Getting Comments:', req.query)
        const { filterBy } = req.query.params
        const comments = await commentService.query(filterBy)
        res.json(comments)
    } catch (err) {
        logger.error('Failed to get comments', err)
        res.status(400).send({ err: 'Failed to get comments' })
    }
}

export async function getCommentById(req, res) {
    try {
        const commentId = req.params.id
        const comment = await commentService.getById(commentId)
        res.json(comment)
    } catch (err) {
        logger.error('Failed to get comment', err)
        res.status(400).send({ err: 'Failed to get comment' })
    }
}

export async function addComment(req, res) {
    const { loggedinUser } = req
    const owner = await userService.getById(loggedinUser._id)
    console.log('owner:', owner)
    try {
        const comment = req.body
        comment.owner = owner
        comment.owner.rate = comment.owner.rate || 0
        const addedComment = await commentService.add(comment)
        res.json(addedComment)
    } catch (err) {
        logger.error('Failed to add comment', err)
        res.status(400).send({ err: 'Failed to add comment' })
    }
}

export async function updateComment(req, res) {
    try {
        const comment = req.body
        const updatedComment = await commentService.update(comment)
        res.json(updatedComment)
    } catch (err) {
        logger.error('Failed to update comment', err)
        res.status(400).send({ err: 'Failed to update comment' })

    }
}

export async function removeComment(req, res) {
    try {
        const commentId = req.params.id
        console.log('commentId:', commentId)
        const removedId = await commentService.remove(commentId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove comment', err)
        res.status(400).send({ err: 'Failed to remove comment' })
    }
}
