const Post = require('../models/post');
const User = require('../models/users')


const createPost = async(req, res) => {
    const post = new Post(req.body);
    try {
       const savedPost = await Post.save() 
       res.status(200).send('Your post has successfully been saved.........')
    } catch (error) {
        res.status(500)._construct(error.message)
    }
}


const editPost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
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
        const {likes} = req.query
        const queryObject = {};

        if (likes) {
            queryObject.likes = likes
        }
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(queryObject.likes)){
            await Post.updateOne({$push: {likes: queryObject.likes}})
            res.status(200).send('Liked!!!!!')
        }
        else{
            await Post.updateOne({$pull: {likes: queryObject.likes}})
            res.status(200).send('Unliked!!!!!')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}


const getAPosts = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).send(post)
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
