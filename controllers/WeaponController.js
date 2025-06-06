import Weapons from "../models/WeaponModel.js";
import Transactions from "../models/TransactionModel.js";

async function getWeapons(req, res) {
  try {
    const response = await Weapons.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

async function getWeaponById(req, res) {
  try {
    const response = await Weapons.findOne({ where: { id: req.params.id } });
    if (!response) {
      return res.status(404).json({ msg: "Senjata tidak ditemukan" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

async function addWeapons(req, res) {
  try {
    const { name, type, serialNum, condition, location, stok } = req.body;

    // Validasi sederhana, contoh cek name wajib ada
    if (!name) {
      return res.status(400).json({ msg: "Nama senjata wajib diisi" });
    }

    const newWeapon = await Weapons.create({
      name,
      type,
      serialNum,
      condition,
      location,
      stok,
    });

    res.status(201).json({
      msg: "Data Senjata berhasil ditambahkan!",
      data: newWeapon,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

async function deleteWeapons(req, res) {
  try {
    const targetWeapon = req.params.id;

    // Cek dulu apakah senjata ada
    const weapon = await Weapons.findByPk(targetWeapon);
    if (!weapon) {
      return res.status(404).json({ msg: "Senjata tidak ditemukan" });
    }

    await Transactions.destroy({ where: { weaponId: targetWeapon } });
    await Weapons.destroy({ where: { id: targetWeapon } });

    res.status(200).json({ msg: "Data senjata berhasil dihapus!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

async function updateWeapons(req, res) {
  try {
    const { name, type, serialNum, condition, location, stok } = req.body;
    let updateData = {
      name,
      type,
      serialNum,
      condition,
      location,
      stok,
    };

    const [updatedRowsCount] = await Weapons.update(updateData, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        status: "Failed",
        msg: "Update data tidak berhasil, data tidak ditemukan",
      });
    }

    // Ambil data terbaru setelah update
    const updatedWeapon = await Weapons.findByPk(req.params.id);

    res.status(200).json({
      msg: "Data berhasil di Update",
      data: updatedWeapon,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

export { getWeaponById, getWeapons, addWeapons, deleteWeapons, updateWeapons };
