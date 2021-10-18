const express = require('express');
const routers = new express.Router();
const User = require('../modals/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account');


//fecthing all user
routers.get('/users/me', auth, async(req, res) => {
    res.status(201).send(req.user);
});


routers.post('/users', async(req, res) => {
    const user = new User(req.body)
    try {
        // create toke to sign up
        //sendWelcomeEmail(user.email, user.name);
        const token = await user.geneAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

});

routers.post('/users/login', async(req, res) => {
    try {
        // find user by email and comfirm password to login
        const user = await User.findByIdCredentials(req.body.email, req.body.password);
        // create token to login
        const token = await user.geneAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(401).send(e);
    }
});


// logout 1 user
routers.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(201).send();
    } catch (e) {
        res.status(404).send();
    }
})



module.exports = routers;