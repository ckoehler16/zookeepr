const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const { route } = require('../htmlRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;
