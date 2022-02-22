const express = require('express');
const { Likes, Posts } = require('../models')
const router = express.Router();

// 좋아요 누르기
router.post('/:postId/like', async (req, res) => {
    const { id } = res.locals;
    const post_id = parseInt(req.params.postId);

    const like = await Likes.findOne({ where: { user_id: id, post_id } });
    if (like) {
        res.status(401).send({
            success: false,
            errorMessage: '이미 좋아요한 게시글입니다.'
        })
        return;
    }

    const post = await Posts.findOne({ where: { id: post_id } });
    if (!post) {
        res.status(401).send({
            success: false,
            errorMessage: '존재하지 않는 게시글입니다.'
        });
        return;
    }


    await Likes.create({
        post_id,
        user_id: id
    });

    res.status(201).send({
        success: true
    });
});

// 좋아요 제거
router.delete('/:postId/like', async (req, res) => {
    const { id } = res.locals;
    const post_id = parseInt(req.params.postId);

    const like = await Likes.findOne({ where: { user_id: id, post_id } });
    if (!like) {
        res.status(401).send({
            success: false,
            errorMessage: '좋아요를 하지 않은 게시글입니다.'
        })
        return;
    }

    const post = await Posts.findOne({ where: { id: post_id } });
    if (!post) {
        res.status(401).send({
            success: false,
            errorMessage: '존재하지 않는 게시글입니다.'
        });
        return;
    }

    await Likes.destroy({ where: { post_id, user_id: id } });

    res.send({
        success: true
    });
});


module.exports = router;