import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function query(filterBy = { txt: '' }) {
    console.log('from service:', filterBy)
    try {
        const criteria = {}
        if (filterBy.txt) {
            criteria.$or = [
                { message: { $regex: filterBy.txt, $options: 'i' } }
            ]
        }

        const collection = await dbService.getCollection('comment')
        const comments = await collection.find(criteria).toArray()
        return comments
    } catch (err) {
        logger.error('cannot find comments', err)
        throw err
    }
}

async function getById(commentId) {
    try {
        const collection = await dbService.getCollection('comment')
        const comment = collection.findOne({ _id: new ObjectId(commentId) })
        return comment
    } catch (err) {
        logger.error(`while finding comment ${commentId}`, err)
        throw err
    }
}

async function remove(commentId) {
    try {
        const collection = await dbService.getCollection('comment')
        await collection.deleteOne({ _id: new ObjectId(commentId) })
        return commentId
    } catch (err) {
        logger.error(`cannot remove comment ${commentId}`, err)
        throw err
    }
}

async function add(comment) {
    try {
        const collection = await dbService.getCollection('comment')
        await collection.insertOne(comment)
        return comment
    } catch (err) {
        logger.error('cannot insert comment', err)
        throw err
    }
}

async function update(comment) {
    try {
        const commentToSave = {
            to: comment.to,
            message: comment.message
        }
        const collection = await dbService.getCollection('comment')
        await collection.updateOne({ _id: new ObjectId(comment._id) }, { $set: commentToSave })
        return comment
    } catch (err) {
        logger.error(`cannot update comment ${comment._id}`, err)
        throw err
    }
}

export const commentService = {
    remove,
    query,
    getById,
    add,
    update,
}