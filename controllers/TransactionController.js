import Transactions from "../models/TransactionModel.js";

//GET : mengambil semua data transaksi
async function getTransaction(req, res) {
    try {
        const response = await Transactions.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

async function getTransactionByUserId(req, res) {
    try {
        const response = await Transactions.findOne({
            where : {
                userId : req.params.userId
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

async function getTransactionById(req, res) {
    try {
        const response = await Transactions.findOne({
            where : {
                id: req.params.id
            }
        })
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

async function addTransaction(req, res) {
    try {
        const {type_transactions, amount, information, status, userId, weaponId } = req.body;
        await Transactions.create({
            type_transactions:type_transactions,
            amount:amount,
            information:information,
            status:status,
            userId:userId,
            weaponId:weaponId,
        });
        res.status(200).json({msg:"Data Transaksi berhasil ditambahkan!"});
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteTransaction (req,res) {
    try {
        const targetTransaksi = req.params.id;
        await Transactions.destroy({
            where : {
                id : targetTransaksi
            }
        });
        res.status(200).json({msg:"Transaksi berhasil di delete!"});
    } catch (error) {
        console.log(error.message);
    }
}

async function updateTransaction(req, res) {
    try {
        const {type_transactions,amount,information,status} = req.body;
        let updateData = {
            type_transactions, amount, information, status
        }

        const result = Transactions.update(updateData, {
            where : {
                id: req.params.id
            }
        })

        if (result[0] === 0 ) {
            res.status(404).json({
                status : "failed",
                message : "Transaksi tidak ditemukan atau transaksi tidak berubah",
                updateData : updateData,
                result
            })
        }

        res.status(200).json(result);
        console.log("Data berhasil di update");


    } catch (error) {
        console.log(error.message);
    }
}

export {getTransaction, addTransaction, updateTransaction, getTransactionById, deleteTransaction, getTransactionByUserId};