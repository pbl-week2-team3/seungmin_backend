const express = require('express');
const { Comments } = require('../models')
const router = express.Router();

router.post('/:postId', async (req, res) => {
    const { id } = res.locals;
    const { text } = req.body;
    const post_id = parseInt(req.params.postId);

    await Comments.create({
        user_id: id,
        post_id,
        text
    })

    res.send({
        success: true
    });
});

router.put('/:postId/:commentId', async (req, res) => {
    const { id } = res.locals;
    const { text } = req.body;
    const comment_id = parseInt(req.params.commentId);
    const post_id = parseInt(req.params.postId);

    const comment = await Comments.findOne({ where: { id: comment_id, post_id } });
    // postId가 이상해도 위에서 걸러짐.
    if (!comment || id !== comment.user_id) {
        res.status(401).send({
            success: false,
            errorMessage: '해당 댓글을 수정할 수 없습니다.'
        })
        return;
    }

    await Comments.update({ text }, { where: { id: comment_id } })

    res.send({
        success: true
    })
});

router.delete('/:postId/:commentId', async (req, res) => {
    const { id } = res.locals;
    const comment_id = parseInt(req.params.commentId);
    const post_id = parseInt(req.params.postId);

    const comment = await Comments.findOne({ where: { id: comment_id, post_id } });
    // postId가 이상해도 위에서 걸러짐.
    if (!comment || id !== comment.user_id) {
        res.status(401).send({
            success: false,
            errorMessage: '해당 댓글을 삭제할 수 없습니다.'
        })
        return;
    }

    await Comments.destroy({ where: { id: comment_id } });

    res.send({
        success: true,
    })
});

module.exports = router;