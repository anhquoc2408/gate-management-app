const Vehicle = require('../models/Vehicle');
const ExcelJS = require('exceljs');
function formatDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//  1. Lấy tất cả xe
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [['checkin_time', 'DESC']]
    });
    const formatted = vehicles.map(v => ({
      ...v.toJSON(),
      checkin_time: formatDateTime(v.checkin_time),
      checkout_time: formatDateTime(v.checkout_time)
  }));

  res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check-in
exports.createVehicle = async (req, res) => {
  try {
    console.log('Check-in request body:', req.body); // log dữ liệu
    const { license_plate, driver_name, cargo_name, checkin_time, image_url, checkin_image } = req.body;

    if (!license_plate) return res.status(400).json({ message: 'license_plate is required' });
    if (!checkin_time) return res.status(400).json({ message: 'checkin_time is required' });

    const vehicle = await Vehicle.create({
      license_plate,
      driver_name,
      cargo_name,
      checkin_time: new Date(checkin_time), // parse datetime
      image_url,
      checkin_image,
      transaction_type: 'IN'
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check-out
exports.updateCheckout = async (req, res) => {
  try {
    //console.log('Check-out request body:', req.body);
    const { id } = req.params;
    const { checkout_time, checkout_image } = req.body;

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (!checkout_time) return res.status(400).json({ message: 'checkout_time is required' });

    vehicle.checkout_time = new Date(checkout_time);
    vehicle.checkout_image = checkout_image;
    vehicle.transaction_type = 'OUT';
    await vehicle.save();

    res.json(vehicle);
  } catch (error) {
    console.error('Error updating checkout:', error);
    res.status(500).json({ message: error.message });
  }
};


//  4. Xuất báo cáo Excel
exports.exportExcel = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [['checkin_time', 'DESC']]
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Vehicles');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'License Plate', key: 'license_plate', width: 20 },
      { header: 'Driver Name', key: 'driver_name', width: 25 },
      { header: 'Cargo Name', key: 'cargo_name', width: 25 },
      { header: 'Check-in Time', key: 'checkin_time', width: 20 },
      { header: 'Check-out Time', key: 'checkout_time', width: 20 },
      { header: 'Transaction Type', key: 'transaction_type', width: 10 },
      { header: 'Check-in Image', key: 'checkin_image', width: 30 },
      { header: 'Check-out Image', key: 'checkout_image', width: 30 },
      { header: 'Image URL', key: 'image_url', width: 30 }
    ];

    vehicles.forEach(v => {
      const data = v.toJSON();
      data.checkin_time = formatDateTime(data.checkin_time);
      data.checkout_time = formatDateTime(data.checkout_time);
      sheet.addRow(data);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=Vehicles_Report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
