import express from 'express'

const router = express.Router();

router.get('/api/users/current', async (req, res) => {
    res.status(200).send({ id: req.currentUser?.id, email: req.currentUser?.email })
});

export { router as currentUserRouter };