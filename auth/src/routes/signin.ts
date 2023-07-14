import express from 'express'

const router = express.Router();

router.get('/api/users/signin', (req,res,next) => {
    res.status(200).send('<h1>Signin</h1>')
});

export { router as signinRouter };