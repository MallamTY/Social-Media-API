const express = require('express');
const { userAuthentication } = require('../middlewares/userAuthentication');
const { createPost, 
        editPost,
        deletePost,
        likeUnlikePost,
        getAPosts,
        timeline } = require('../controllers/postController')
        
const router = express.Router()

router.use(userAuthentication)

router.route('/posts').post(createPost)

router.route('/post/:id').post(editPost).delete(deletePost)

router.route('/:id').patch(likeUnlikePost).get(getAPosts)

router.route('/:id').get(timeline)


module.exports = router