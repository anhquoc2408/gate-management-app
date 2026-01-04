const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');

// Lấy tất cả xe
router.get('/', vehicleController.getAllVehicles);

// Thêm xe/hàng mới
router.post('/', vehicleController.createVehicle);

// Cập nhật checkout
router.put('/:id/checkout', vehicleController.updateCheckout);

// Xuất báo cáo Excel
router.get('/export', vehicleController.exportExcel);

module.exports = router;
