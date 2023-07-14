import express from 'express'

const router = express.Router();

router.get('/api/users/signout', (req,res,next) => {
    res.status(200).send('<h1>Signout</h1>')
});

export { router as signoutRouter };