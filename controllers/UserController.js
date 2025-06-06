import User from "../models/UserModel.js";
import Transactions from "../models/TransactionModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Transaction } from "sequelize";

//GET : mengambil data dari table user (findAll)
async function getUsers(req, res) {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
        console.log("Data user berhasil diambil");
    } catch (error) {
        console.log(error.message);
    }
}

// GET BY ID : mengambil data dari table user berdasarkan userID (findOne)
async function getUserById(req, res) {
    try {
        const response = await User.findOne({where : {id : req.params.id }});
        res.status(200).json(response);
        console.log("User dengan", req.params.id, " berhasil diambil");
    } catch (error) {
        console.log(error);
    }
}

// POST : digunakan untuk user membuat atau mengirimkan data baru atau registrasi
async function createUser(req, res) {
    try {
        const {name, email, password} = req.body;
        const encryptPassword = await bcrypt.hash(password, 5);
        await User.create({
            name : name,
            email : email,
            password : encryptPassword,
        });
        res.status(200).json({msg:"Registrasi Berhasil!"});
    } catch (error) {
        console.log(error);
    }
}

async function updateUser(req, res) {
    try {
        // menangkap variable update dari request body
        const {name, email, password, role} = req.body;
        let updateData = {
            name, email, role
        } // data update disimpan pada variable object

        // mengubah update password menjadi hash sebelum dimasukan ke dalam database
        if (password) {
            const encryptPassword = await bcrypt.hash(password,5);
            //  masukan password yang sudah dalam bentuk hash ke object updateData
            updateData.password = encryptPassword;
        }

        // kemudian kirim ke database dengan update sesuai dengan params.id yang diterima
        const result = await User.update(updateData, {
            where : {
                id : req.params.id
            }
        });

        // mengecek apakah data berhasil terupdate atau tidak
        if (result[0] === 0 ) {
            return res.status(404).json({
                status : "failed",
                message : 'user tidak ditemukan atau tidak ada data yang berubah',
                updateData : updateData,
                result
            });
        }
        // jika data berhasil terupdate, maka kembalikan res.status(200)
        res.status(200).json(result);
        console.log("Data berhasil untuk diupdate!");
    } catch (error) {
        console.log(error);
    }
}

async function deleteUser(req, res) {
    try {
        const targetUser = req.params.id;

        //karena foreign key, maka pada tabel tarnsaksion harus dihapus dulu agar tidak error dalam database
        await Transactions.destroy({
            where : 
            {
                UserId : targetUser
            }
        });
        //setelah pada transaksi dihapus, maka hapus data user yang ingin dihapus
        await User.destroy({
            where : {
                id : targetUser
            }
        })

        res.status(200).json({msg:"User berhasil dihapus!"});
    } catch (error) {
        console.log(error);
    }
}

// Fungsi untuk login handler atau menangani login user
async function loginHandler(req, res) {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: "Failed",
                message: "Email atau password salah",
            });
        }

        // Konversi user dari Sequelize ke plain object
        const userPlain = user.toJSON();

        // Cek password (bcrypt compare)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: "Failed",
                message: "Email atau password salah",
            });
        }

        // Ambil data user yang aman untuk dikirim ke frontend (tanpa password)
        const { password: _, refreshToken: __, ...safeUserData } = userPlain;

        // Kirim response sukses
        return res.status(200).json({
            status: "Success",
            message: "Login berhasil",
            user: safeUserData,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "Error",
            message: "Terjadi kesalahan saat login",
        });
    }
}


// Fungsi logout sederhana tanpa refresh token
async function logout(req, res) {
  try {
    // Jika kamu masih menggunakan cookie (untuk session), kamu bisa hapus cookies di sini// Optional, kalau tidak dipakai bisa dihapus baris ini

    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat logout',
    });
  }
}


export {getUsers,getUserById,loginHandler,deleteUser,logout,updateUser,createUser}