const express = require('express');
const joi = require('joi');
const router = express.Router();
const { Users } = require('../models');



/*
 * 1. 회원 가입 페이지
 *  - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 
 *    숫자(0~9)`로 구성하기
 *  - 비밀번호는 `최소 4자 이상이며, 
 *    닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
 *  - 비밀번호 확인은 비밀번호와 정확하게 일치하기
 */
router.post('/register', async (req, res, next) => {
    const { id, nickname, password, password_check, profile_img_url } = req.body;

    const registerSchema = joi.object({
        id: joi.string().alphanum().min(3).max(25).required(),
        nickname: joi.string().min(3).max(9).required(),
        profile_img_url: joi.string().required(),
        password: joi.string().required(),
        password_check: joi.required()
    });

    if (registerSchema.validate(req.body).error || password === password_check) {
        res.send({
            success: false,
            errorMessage: '다시 입력해주세요.'
        });
        return;
    }

    const existUser = await Users.findOne({ where: { id, nickname } });


    if (existUser) {
        res.send({
            success: false,
            errorMessage: '닉네임 또는 아이디가 중복되는 유저가 있습니다.'
        });
        return;
    }


    // 가입 하면 됨!
    await Users.create({
        id,
        nickname,
        password,
        img_url: profile_img_url
    })
    res.send({
        success: true
    })
});

module.exports = router;