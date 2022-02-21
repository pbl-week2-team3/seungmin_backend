const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use((req, res, next) => {
    const { authorization } = req.cookies;
    try {
        // { id, nickname } 꼴로 locals.user에 들어있음.
        res.locals = jwt.verify(authorization, 'secret');
        next();
    } catch (err) {
        // 토큰이 유효하지 않음
        res.status(400).send({
            success: false,
            errorMessage: '로그인 후 이용 바랍니다.'
        })
        return;
    }
});

module.exports = router;