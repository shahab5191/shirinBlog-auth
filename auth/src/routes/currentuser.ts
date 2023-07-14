import express from 'express'

const router = express.Router();

router.get('/api/users/currentuser', (req,res,next) => {
    res.status(200).send('<h1>Welcome user</h1>')
});

export { router as currentUserRouter };