import Weapons from "../models/WeaponModel.js";
import Transactions from "../models/TransactionModel.js";
import { Op } from "sequelize";

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
    const { name, type, serialNum, condition, location, stok, imageUrl } = req.body;

    // Validasi dasar
    if (!name || !type || !serialNum || !condition || !location || !stok) {
      return res.status(400).json({ msg: "Semua field wajib diisi." });
    }

    // Cek apakah senjata dengan semua field (kecuali id & waktu) sudah ada
    const existingWeapon = await Weapons.findOne({
      where: {
        name,
        type,
        serialNum,
        condition,
        location,
        imageUrl,
      },
    });

    if (existingWeapon) {
      // Update hanya stok jika match semua field
      const newStok = existingWeapon.stok + parseInt(stok);
      await existingWeapon.update({ stok: newStok });

      return res.status(200).json({
        msg: "Data senjata sudah ada. Stok berhasil diperbarui.",
        data: existingWeapon,
      });
    }

    // Jika tidak ada match → Buat data baru
    const newWeapon = await Weapons.create({
      name,
      type,
      serialNum,
      condition,
      location,
      stok,
      imageUrl,
    });

    res.status(201).json({
      msg: "Senjata baru berhasil ditambahkan!",
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
    const weaponId = req.params.id;

    // Validasi dasar
    if (!name || !type || !serialNum || !condition || !location || !stok) {
      return res.status(400).json({ msg: "Semua field wajib diisi." });
    }

    const currentWeapon = await Weapons.findByPk(weaponId);

    if (!currentWeapon) {
      return res.status(404).json({ msg: "Senjata tidak ditemukan" });
    }

    // Cek apakah ada senjata lain (beda ID) dengan field yang sama (kecuali stok & id)
    const existingWeapon = await Weapons.findOne({
      where: {
        name,
        type,
        serialNum,
        condition,
        location,
        // Pastikan bukan senjata yang sedang diupdate
        id: { [Op.ne]: weaponId }
      },
    });

    if (existingWeapon) {
      // Jika ada yang match → tambah stok ke existingWeapon & hapus yang sekarang
      const updatedStok = existingWeapon.stok + parseInt(stok);
      await existingWeapon.update({ stok: updatedStok });
      await currentWeapon.destroy();

      return res.status(200).json({
        msg: "Field senjata cocok dengan data lain. Stok ditambahkan ke entri tersebut, entri ini dihapus.",
        data: existingWeapon,
      });
    }

    // Tidak ada yang cocok → update biasa
    await currentWeapon.update({
      name,
      type,
      serialNum,
      condition,
      location,
      stok,
      imageUrl
    });

    res.status(200).json({
      msg: "Data senjata berhasil diupdate",
      data: currentWeapon,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

async function getSummary(req, res) {
  try {
    const totalWeapons = await Weapons.sum('stok');

    const weaponsGoodCondition = await Weapons.sum('stok',{
      where: { condition: 'Good' },
    });

    const weaponsDamaged = await Weapons.sum('stok',{
      where: { condition: 'Bad' },
    });

    const uniqueLocations = await Weapons.findAll({
      attributes: ['location'],
      group: ['location'],
    });
    const totalWarehouses = uniqueLocations.length;

    res.status(200).json({
      totalWeapons,
      weaponsGoodCondition,
      weaponsDamaged,
      totalWarehouses,
    });
  } catch (error) {
    console.error('Error in getSummary:', error.message);
    res.status(500).json({ msg: 'Gagal mengambil data ringkasan' });
  }
}



export { getWeaponById, getWeapons, addWeapons, deleteWeapons, updateWeapons, getSummary };
