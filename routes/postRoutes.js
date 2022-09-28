const express = require('express');
const { userAuthentication } = require('../middlewares/userAuthentication');
const { createPost, 
        editPost,
        deletePost,
        likeUnlikePost,
        getAPosts,
        currentUserTimeline } = require('../controllers/postController')
        
const router = express.Router()

router.use(userAuthentication)

router.route('/posts').post(createPost)

router.route('/post/:id').post(editPost).delete(deletePost)

//router.route('/:id').put(likeUnlikePost).get(getAPosts)

//router.patch('/:id', likeUnlikePost)

router.route('/timeline/all').get(currentUserTimeline)


module.exports = router