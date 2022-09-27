const express = require('express');
const { createPost, 
        editPost,
        deletePost,
        likeUnlikePost,
        getAPosts,
        timeline } = require('../controllers/controllers');
        
const router = express.Router()


router.use('/posts').post(createPost)

router.use('/post/:id').post(editPost).delete(deletePost)

router.use('/:id').patch(likeUnlikePost).get(getAPosts)

router.get('/:id').get(timeline)


module.exports = router