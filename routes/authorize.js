const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use((req, res, next) => {
    try {
        const { token } = req.cookies;
        // { id, nickname } 꼴로 locals.user에 들어있음.
        res.locals = jwt.verify(token, 'secret');

    } catch (err) {
        // 토큰이 유효하지 않음
        res.locals = { id: '', nickname: '' }
    }
    next();
});

module.exports = router;