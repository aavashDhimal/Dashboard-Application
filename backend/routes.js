const express = require('express');

const router = express.Router()

const authController = require('./controllers/authController');
const logsController = require('./controllers/logsController')
const {checkToken} = require('./middlewares/authMiddleware');

//Auth Routes 
router.post('/auth/register',authController.registerUser);

router.post('/auth/login',authController.login);

router.get('/load_logs',checkToken,logsController.populateLogs);

router.get('/get_data',checkToken,logsController.getData);

router.get('/get_table_data',checkToken,logsController.getTableData);

module.exports = router;