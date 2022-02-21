const express = require('express');
const { Comments, Posts, Users, Likes } = require('../models')
const router = express.Router();

// 전체 게시글 불러오기
router.get('/', async (res, req) => {
    const { id } = res.locals;

    const posts = await Posts.findAll({ order: [['id', 'DESC']] }); // 수정 되어도 글은 밑에 위치하게 됨.

    for (let i = 0; i < posts.length; i++) {
        posts[i].byMe = user_id === posts[i].id ? true : false;

        const { nickname, img_url } = await Users.findOne({ where: { user_id } });
        posts[i].nickname = nickname;
        posts[i].profile_img_url = img_url;

        const like = await Likes.findOne({ where: { id: user_id, post_id } });
        const like_cnt = await Likes.count({ where: { post_id, user_id: id } });
        const comment_cnt = await Comments.count({ where: { post_id, } });

        posts[i].like_cnt = like_cnt;
        posts[i].comment_cnt = comment_cnt;
        posts[i].likeByMe = like ? true : false;
    }

    res.json(posts);
});

// 특정 게시글 조회
router.get('/:postId', async (req, res) => {
    const { id } = res.locals;
    const post_id = parseInt(req.params.postId);

    // 게시글이 존재하는지?
    const post = await Posts.findOne({ id: post_id });
    if (!post) {
        res.send({
            success: false,
            errorMessage: '해당 글이 존재하지 않습니다.'
        })
        return;
    }

    // 좋아요를 몇개 눌렀는지?, 내가 좋아요 눌렀는지?
    const like = await Likes.findOne({ id: user_id, post_id });
    post.likes = await Likes.findAll({ where: { post_id } }).length;
    post.byMe = id === post.user_id ? true : false;
    post.likeByMe = like ? true : false;
    Users.findOne({ id: post.user_id }).then((user) => {
        post.profile_img_url = user.img_url
    });

    // 댓글들과 댓글 작성 유저들의 프로필 사진
    post.comments = await Comments.findAll({ where: { post_id }, order: [['id', 'DESC']] });

    for (let i = 0; i < post.comments.length; i++) {
        post.comments[i].profile_img_url = await Users.findOne({ id: post.comments[i].user_id }).img_url;
    }

    res.send({
        success: true,
        post
    })
});

// 게시글 작성
// 이미지 받는 걸 추가해야함.
router.post('/', async (req, res) => {
    const { id } = res.locals;
    const { contents, img_url } = req.body;

    if (!contents) {
        res.status(401).send({
            success: false,
            errorMessage: '게시글을 작성해주세요.'
        });
        return;
    }

    await Posts.create({
        contents,
        user_id: id,
        img_url
    })

    res.status(201).send({
        success: true
    });
});

// 게시글 수정
router.put('/:postId', async (req, res) => {
    const { id } = res.locals;
    const post_id = parseInt(req.params.postId);

    const post = await Posts.findOne({ where: { id: post_id } });

    if (!post || post.user_id !== id) {
        res.status(401).send({
            success: false,
            errorMessage: '해당 글을 수정할 수 없습니다.'
        })
        return;
    }

    const { contents, img_url } = req.body;
    await Posts.update(
        { contents, img_url, },
        { where: { id: post_id } }
    );

    res.send({
        success: true,
    })
});

// 게시글 삭제
router.delete('/:postId', async (req, res) => {
    const { id } = res.locals;
    const post_id = pasreInt(req.params.postId);

    const post = await Posts.findOne({
        where: {
            id: post_id
        }
    });

    if (!post || post.user_id !== id) {
        res.status(401).send({
            success: false,
            errorMessage: '해당 글을 삭제할 수 없습니다.'
        })
        return;
    }

    await Posts.destroy({
        where: {
            id: post_id
        }
    });

    await Comments.destroy({
        where: {
            post_id
        }
    });

    await Likes.destroy({
        where: {
            post_id
        }
    });

    res.send({
        success: true,
    });
});


module.exports = router;