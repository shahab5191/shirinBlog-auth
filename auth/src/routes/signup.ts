import express from 'express'

const router = express.Router();

router.get('/api/users/signup', (req,res,next) => {
    res.status(200).send('<h1>Signup</h1>')
});

export { router as signupRouter };