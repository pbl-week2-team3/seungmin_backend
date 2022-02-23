const express = require('express');
const jwt = require('jsonwebtoken');
const authorize = require('./authorize');
const { Users } = require('../models');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        // 이미 로그인 한 상태이면
        const { authorization } = req.cookies;
        jwt.verify(authorization, 'secret');
        res.status(400).send({
            success: false,
            errorMessage: '이미 로그인 된 상태입니다.'
        });
        return;
    } catch (err) { }

    const { id, password } = req.body;


    const existUser = await Users.findOne({ where: { id, password } });
    if (!existUser) {
        res.status(400).send({
            success: false,
            errorMessage: '아이디나 비밀번호를 확인해주세요.'
        });
        return;
    }

    const nickname = existUser.nickname;
    const token = jwt.sign(
        { id, nickname },
        'secret',
        { expiresIn: 3600 }
    );


    res.cookie('token', token, { maxAge: 3600 * 1000 });
    res.status(201).send({
        success: true
    });
});


router.get('/logout', authorize, (req, res) => {
    try {
        res.clearCookie('token');
        res.send({
            success: true
        })
    } catch (err) {
        res.send({
            success: false,
            errorMessage: '로그인 후 이용해주세요.'
        })
    }

});

module.exports = router;