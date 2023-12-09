const express = require('express')
const router = express.Router();
const db = require('../database.js')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: ''
})

//Get all devices
router.get('/', async (req, res) => {
  const [result] = await db.promise().query('SELECT * FROM DEVICES');
  res.status(200).send(result);
});

//Get specific device by id
router.get('/:id', getDevice, async (req, res) => {
  res.status(200).send(res.device);
});

//Create a device
router.post('/', async (req, res) => {
  const {name, description, serial_number, manufacturer} = req.body;
  if(!(name && description && serial_number && manufacturer))
  {
    return res.status(400).send("Not every value was provided");
  }

  try {
    await db.promise().query(`INSERT INTO DEVICES (name, description, serial_number, manufacturer, is_borrowed) VALUES('${name}', '${description}', '${serial_number}', '${manufacturer}', ${'0'})`);
    res.status(201).send({msg: 'Created device'})
  } catch(err) {
    res.status(400).send(err);
  }
});

//Update a device by id
router.put('/:id', getDevice, async (req, res) => {
  const {name, description, serial_number, manufacturer} = req.body;
  device = res.device;
  if(name != null) {
    device.name = name;
  }
  if(description != null) {
    device.description = description;
  }
  if(serial_number != null) {
    device.serial_number = seri
    al_number;
  }
  if(manufacturer != null) {
    device.manufacturer = manufacturer;
  }

  try {
    await db.promise().query(`UPDATE DEVICES SET name = '${device.name}', description = '${device.description}', 
    serial_number = '${device.serial_number}', manufacturer = '${device.manufacturer}' WHERE id = '${device.id}'`)
    res.json(device);
  } catch (err) {
    res.status(500).json({error: err.message});
  }

});

//Delete device
router.delete("/:id", getDevice, async (req, res) => {
  try {
  await db.promise().query(`DELETE FROM DEVICES WHERE id = '${res.device.id}'`);
  res.status(200).json({message: `device ${res.device.name} was deleted`});
  } catch (err) {
    res.status(500).send({message: err.message});
  }
});

//function to get device by id, so we don't have to rewrite the same code in our endpoints
async function getDevice(req, res, next) {
  let device;
  try {
    [device] = await db.promise().query(`SELECT * FROM DEVICES WHERE id = ${req.params.id}`)
    if(device[0] == null) {
      return res.status(400).json({message: 'Device was not found'})
    }
  } catch (err) {
    res.status(500).json({error : err.message})
  }

  res.device = device[0];
  next();
}

module.exports = router;