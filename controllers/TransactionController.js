import Transactions from "../models/TransactionModel.js";
import Weapons from "../models/WeaponModel.js";
import User from "../models/UserModel.js";

// GET all transactions
async function getTransaction(req, res) {
  try {
    const response = await Transactions.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Weapons,
          attributes: ["id", "serialNum", "name", "location", "imageUrl"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan saat mengambil transaksi" });
  }
}

// GET transaction by user ID
async function getTransactionByUserId(req, res) {
  try {
    const response = await Transactions.findAll({
      where: {
        userId: req.params.userId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Weapons,
          attributes: ["id", "serialNum", "name", "location", "imageUrl"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan saat mengambil transaksi user" });
  }
}

// GET transaction by transaction ID
async function getTransactionById(req, res) {
  try {
    const response = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan saat mengambil transaksi" });
  }
}

// POST - Add transaction (stok hanya berubah jika status = 'approved')
async function addTransaction(req, res) {
  try {
    const { type_transactions, amount, information, status, userId, weaponId } = req.body;

    const weapon = await Weapons.findByPk(weaponId);
    if (!weapon) {
      return res.status(404).json({ msg: "Senjata tidak ditemukan" });
    }

    if (status === "approved") {
      let updatedStok = weapon.stok;

      if (type_transactions === "in") {
        updatedStok += parseInt(amount);
      } else if (type_transactions === "out") {
        if (weapon.stok < amount) {
          return res.status(400).json({ msg: "Stok senjata tidak mencukupi" });
        }
        updatedStok -= parseInt(amount);
      }

      await weapon.update({ stok: updatedStok });
    }

    await Transactions.create({
      type_transactions,
      amount,
      information,
      status,
      userId,
      weaponId,
    });

    res.status(200).json({ msg: "Data transaksi berhasil ditambahkan" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

// PUT - Update transaction and sync stok only if approved
async function updateTransaction(req, res) {
  try {
    const id = req.params.id;
    const { type_transactions, amount, information, status } = req.body;

    const oldTransaction = await Transactions.findByPk(id);
    if (!oldTransaction) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    const weapon = await Weapons.findByPk(oldTransaction.weaponId);
    if (!weapon) {
      return res.status(404).json({ msg: "Senjata tidak ditemukan" });
    }

    let stok = weapon.stok;

    // Rollback stok jika status sebelumnya adalah 'approved'
    if (oldTransaction.status === "approved") {
      if (oldTransaction.type_transactions === "in") {
        stok -= oldTransaction.amount;
      } else if (oldTransaction.type_transactions === "out") {
        stok += oldTransaction.amount;
      }
    }

    // Terapkan stok baru jika status sekarang adalah 'approved'
    if (status === "approved") {
      if (type_transactions === "in") {
        stok += parseInt(amount);
      } else if (type_transactions === "out") {
        if (stok < amount) {
          return res.status(400).json({ msg: "Stok senjata tidak mencukupi untuk update transaksi" });
        }
        stok -= parseInt(amount);
      }
    }

    await weapon.update({ stok });

    await Transactions.update(
      {
        type_transactions,
        amount,
        information,
        status,
      },
      {
        where: { id },
      }
    );

    res.status(200).json({ msg: "Transaksi berhasil diupdate" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

// DELETE - Delete transaction and rollback stok only if status was 'approved'
async function deleteTransaction(req, res) {
  try {
    const id = req.params.id;

    const transaksi = await Transactions.findByPk(id);
    if (!transaksi) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    const weapon = await Weapons.findByPk(transaksi.weaponId);
    if (!weapon) {
      return res.status(404).json({ msg: "Senjata tidak ditemukan" });
    }

    let stok = weapon.stok;

    if (transaksi.status === "approved") {
      if (transaksi.type_transactions === "in") {
        stok -= transaksi.amount;
      } else if (transaksi.type_transactions === "out") {
        stok += transaksi.amount;
      }

      await weapon.update({ stok });
    }

    await Transactions.destroy({
      where: { id },
    });

    res.status(200).json({ msg: "Transaksi berhasil dihapus dan stok diperbarui" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
}

export {
  getTransaction,
  getTransactionByUserId,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
