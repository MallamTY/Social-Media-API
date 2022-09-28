const { StatusCodes } = require('http-status-codes');
const Post = require('../models/post');
const User = require('../models/users')


const createPost = async(req, res) => {
    const {body: {description, image},
          user: {username, currentUser_id}} = req;

    const post = new Post({
                            description, 
                            image, 
                            username,
                            userId: currentUser_id
                        });
                        
    try {
       const savedPost = await post.save() 
       res.status(StatusCodes.CREATED).json({
                                            status: `Success ...`,
                                            message: `Your post has successfully been created.........`,
                                            savedPost
                                        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
    }
}


const editPost = async(req, res) => {
    try {
        const post = await Post.findOne(req.params.username)
        if(post.userId === req.params.userId){
            await Post.updateOne({$set: req.body})
            res.status(200).send('Your post has successfully been updated.............')
        }
        else{
            res.status(403).send('You can only update a post made by you!!!!!!!!!!!!!')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}



const deletePost =  async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post){
            if(post.userId === req.body.userId){
                await Post.deleteOne()
                res.status(200).send('Your post has successfully been deleted.............')
            }
             else{
                 res.status(403).send('You can only delete a post made by you!!!!!!!!!!!!!')
             }
        }
        else{
            res.status(403).send('Post has already been delted!!!!!!!!!!!')
        }
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}


const likeUnlikePost = async(req, res) => {
    try {
        const {user: {currentUser_id},
                params: {id}} = req;

                console.log(req.params.id);

        const queryObject = {};

        if (currentUser_id) {
            queryObject.currentUser = currentUser_id;
        }
        if(id) {
            queryObject.id = id
        }
       // console.log(queryObject);
        let post = await Post.findById(queryObject.id)
        if(!post.likes.includes(queryObject.currentUser)){
            await Post.findOneAndUpdate({_id: queryObject.id},{$push: {likes: queryObject.currentUser}})
            res.status(StatusCodes.EXPECTATION_FAILED).json({
                                                           status: 'Successful',
                                                           message: `Liked!!!`,
                                                           nbLikes: post.likes.length,
                                                           likes: unlike.likes
                                                         })
        }
        else{
            const unlike = await Post.findOneAndUpdate({_id: queryObject.id},{$pull: {likes: queryObject.currentUser}})
            res.status(StatusCodes.OK).json({
                                            status: 'Successful',
                                            message: `Unliked !!!`,
                                            nbLikes: post.likes.length,
                                            likes: unlike.likes
                                            })
        }
    } catch (error) {
        console.log(error);
    }
}


const getAPosts = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(StatusCodes.OK).json({
                                    status: `Successful`,
                                    post
                                })
    } catch (error) {
        res.status(500).send(error.message)
    }
}


const timeline = async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({userId: currentUser._id})
        const friendPosts = Promise.all(
            currentUser.following.map((friendId) => {
                Post.findOne({userId: friendId})
            })
        );
        res.status(200).send(userPost.concat(...friendPosts))
    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports = {
    createPost,
    editPost,
    deletePost,
    likeUnlikePost,
    getAPosts,
    timeline
}
