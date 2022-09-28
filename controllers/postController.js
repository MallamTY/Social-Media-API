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

    const {params:{id}, user: {username}} = req;
    try {

        
        const post = await Post.findById(id)
        if(!post){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: `Failed !!!`,
                message: `Post has already been delted!!!!!!!!!!!`
            })
        }

        if(post){
            if(post.username === username){
                await Post.deleteOne()
                res.status(StatusCodes.ACCEPTED).json({
                    status: `Success ...`,
                    message: `Your post has successfully been deleted.............`
                })
            }
             else{
                 res.status(StatusCodes.FORBIDDEN).json({
                    status: `Failed !!!`,
                    message: `You can only delete a post made by you!!!!!!!!!!!!!`
                })
             }
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
            const like = await Post.findOneAndUpdate({_id: queryObject.id},{$push: {likes: queryObject.currentUser}}, {new: true})
            res.status(StatusCodes.EXPECTATION_FAILED).json({
                                                           status: 'Successful',
                                                           message: `Liked!!!`,
                                                           nbLikes: like.likes.length,
                                                           likes: like.likes
                                                         })
        }
        else{
            const unlike = await Post.findOneAndUpdate({_id: queryObject.id},{$pull: {likes: queryObject.currentUser}}, {new: true})
            res.status(StatusCodes.OK).json({
                                            status: 'Successful',
                                            message: `Unliked !!!`,
                                            nbLikes: unlike.likes.length,
                                            likes: unlike.likes
                                            })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
    }
}


const getAPosts = async(req, res) => {
    try {
        const {params: {id}} = req;

        const post = await Post.findById(id);
        if(!post){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: `Failed !!!`,
                message: `No related post !!!`
            })
        }
        res.status(StatusCodes.OK).json({
                                    status: `Successful`,
                                    post
                                })
    } catch (error) {
        res.status(500).send(error.message)
    }
}


const currentUserTimeline = async(req, res) => {

    const {user: {username, currentUser_id}} = req;

    try {
        const currentUser = await User.findById(currentUser_id);
        const userPost = await Post.find({username});

        // const followersPosts = Promise.all(
        //     currentUser.followers.map((friendId) => {
        //         return Post.find({userId: friendId})
        //     })
        // );

         const followingPosts = Promise.all(
             currentUser.following.map((friendId) => {
                 return Post.find({userId: friendId})
                 
             })
         );
         

         const awaitedFollow = await followingPosts
         
        res.status(StatusCodes.OK).json(userPost.concat(...awaitedFollow))//.concat(...followersPosts)
        //)
    } catch (error) {
        res.status(500).send(error)
    }
}

const viewOtherTimeline = async(req, res) => {
    const {query: {username}} = req;

    const queryObject = {};
    if(username) {
        queryObject.username = username;
    }
    const otherUserPost = await Post.find({username: queryObject.username})
    
}


module.exports = {
    createPost,
    editPost,
    deletePost,
    likeUnlikePost,
    getAPosts,
   viewOtherTimeline,
   currentUserTimeline
}
