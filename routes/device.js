const express = require('express')
const router = express.Router();
const db = require('../database.js');
const path = require('path');
const fs = require('fs')
const multer = require('multer');

const Imagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
})

const upload = multer({storage: Imagestorage})

//Get all devices
router.get('/', async (req, res) => {
  const [result] = await db.promise().query('SELECT * FROM DEVICES');
  console.log(result)
  res.status(200).send(result);
});

//Get specific device by id
router.get('/:id', getDevice, async (req, res) => {
  res.status(200).send(res.device);
});

//Create a device
router.post('/upload', upload.single("image"), async (req, res) => {
  const {name, description, serial_number, manufacturer} = req.body;
  if(!(name && description && serial_number && manufacturer && req.file))
  {
    console.log(req.body.name, req.body.manufacturer, req.body.description, req.body.serial_number)
    return res.status(400).send("Not every value was provided");
  }
  try {
    const [result] = await db.promise().query('SELECT * FROM DEVICES');
    const nameExists = result.some(element => name === element.name);
    if(nameExists)
    {
      console.log('name exists')
      res.status(400).send("device with such name already exists");
      return;
    }
    await db.promise().query(`INSERT INTO DEVICES (name, description, serial_number, manufacturer, is_borrowed, image_url) VALUES('${name}', '${description}', '${serial_number}', '${manufacturer}', ${'0'}, 'images\\\\${req.file.filename}')`);
    res.status(201).send({msg: 'Created device'})
  } catch(err) {
    console.log('error')
    res.status(400).send({message: err.message});
  }
});

//Update a device by id
router.put('/:id', getDevice, upload.single('image'), async (req, res) => {
  const {name, description, serial_number, manufacturer} = req.body;
  device = res.device;
  if(name) {
    device.name = name;
  }
  if(description) {
    device.description = description;
  }
  if(serial_number) {
    device.serial_number = serial_number;
  }
  if(manufacturer) {
    device.manufacturer = manufacturer;
  }
  if(req.file) {
    if(res.device.image_url != null) {
      fs.unlinkSync(path.join(__dirname, '../public' ,res.device.image_url), (err) => {
        return res.status(500).send({message: err});
      })
      const imagePath = (('images\\\\' + req.file.filename));
      console.log(imagePath)
      device.image_url = imagePath;
    }
  }
  else
  {
    device.image_url = device.image_url.replace(/\\/g, '\\\\')
  }

  try {
    console.log(device.image_url)
    await db.promise().query(`UPDATE DEVICES SET name = '${device.name}', description = '${device.description}', 
    serial_number = '${device.serial_number}', manufacturer = '${device.manufacturer}', image_url = '${device.image_url}' WHERE id = '${device.id}'`)
    res.json(device);
  } catch (err) {
    res.status(500).json({error: err.message});
  }

});

//Delete device
router.delete("/:id", getDevice, async (req, res) => {
   if(res.device.image_url != null) {
    fs.unlinkSync(path.join(__dirname, '../public' ,res.device.image_url), (err) => {
      return res.status(500).send({message: err});
    })
  }
  try {
  await db.promise().query(`DELETE FROM DEVICES WHERE id = '${res.device.id}'`);
  res.status(200).json({message: `device ${res.device.name} was deleted`});
  } catch (err) {
    res.status(500).send({message: err.message});
  }
});

//Upload an image to device by id
router.post("/image/:id", getDevice, upload.single("image"), async (req, res) => {
  if(res.device.image_url != null) {
    fs.unlinkSync(path.join(__dirname, '../public' ,res.device.image_url), (err) => {
      return res.status(500).send({message: err});
    })
  }
  try {
    const imagePath = (('images\\\\' + req.file.filename));
    console.log(imagePath)
    await db.promise().query(`UPDATE DEVICES SET image_url = '${imagePath}' WHERE id = '${res.device.id}'`);
    res.status(200).send('Image was successfully uploaded');
  } catch (err) {
    res.status(500).send({message: err.message});
  }
})

//function to get device by id, so we don't have to rewrite the same code in our endpoints
async function getDevice(req, res, next) {
  let device;
  try {
    [device] = await db.promise().query(`SELECT * FROM DEVICES WHERE id = ${req.params.id}`)
    if(device[0] == null) {
      return res.status(400).json({message: 'Device was not found'})
    }
  } catch (err) {
    return res.status(500).json({error : err.message})
  }

  res.device = device[0];
  next();
}
module.exports = router;
