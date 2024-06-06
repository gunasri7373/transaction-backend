const fs = require('fs');
const transactionModel = require("../models/transaction.model")

exports.saveData = async (req, res) => {
    try {
        fs.readFile('./transaction.json', (err, data) => {
            if (err) throw err;
            let arrData = JSON.parse(data)
            arrData.forEach(async (element) => {
                const schema = req.body;
                schema.id = element.id;
                schema.date = element.date;
                schema.sender = {
                    firstName: element.sender.firstName,
                    lastName: element.sender.lastName,
                    dateOfBirth: element.sender.dateOfBirth,
                    idNumber: element.sender.IDNumber
                };
                schema.recipient = {
                    firstName: element.recipient.firstName,
                    lastName: element.recipient.lastName,
                    email: element.recipient.email,
                    accountNumber: element.recipient.accountNumber,
                    bank: element.recipient.bank
                }
                schema.amount = element.Amount;
                schema.currencyCd = element.CurrencyCd;
                schema.comments = element.Comments;
                schema.status = element.status;
                const transaction = await transactionModel.create(schema)
            });
        })
        res.status(200).send({
            data: null,
            error: null,
            status: 1,
            message: "Saving Data Successfully"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in creating Transactions."
        })
    }
}

exports.getByDate = async (req, res) => {
    try {
        if (!req.query.startDate || !req.query.endDate) {
            return res.status(400).send({
                message: "Please Enter Dates"
            })
        }
        const startDate = req.query.startDate + "T00:00:00.000Z";
        const endDate = req.query.endDate + "T23:59:59.999Z";
        const transactions = await transactionModel.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
            .select({ id: 1, comments: 1, date: 1 });
        res.status(200).send({
            data: transactions,
            error: null,
            status: 1,
            message: "Retrieved Transactions Successfully"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Retrieving Transactions."
        })
    }
}

exports.list = async (req, res) => {
    try {
        const startDate = req.query.startDate + "T00:00:00.000Z";
        const endDate = req.query.endDate + "T23:59:59.999Z";
        const data = [
            {
                $match: {
                    status: { $in: ["COMPLETED", "IN PROGRESS", "REJECTED"] }
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $project: {
                    id: 1,
                    comments: 1,
                    date: 1,
                    status: 1
                }
            }
        ]
        if (req.query.startDate && req.query.endDate) {
            data.splice(2, 0, {
                $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } }
            })
        }
        const transactions = await transactionModel.aggregate(data);
        res.status(200).send({
            data: transactions,
            error: null,
            status: 1,
            message: 'Retrieved Transactions Successfully.'
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Retrieving Transactions."
        })
    }
}

exports.getById = async (req, res) => {
    try {
        const transaction = await transactionModel.findOne({ _id: req.params.tranId })
            .select({ id: 1, comments: 1, date: 1 });
        res.status(200).send({
            data: transaction,
            error: null,
            status: 1,
            message: "Retrieved Transaction Successfully"
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Retrieving Transaction."
        })
    }
}

exports.update = async (req, res) => {
    try {
        const transaction = await transactionModel.findOneAndUpdate({ _id: req.body.tranId }, req.body, { new: true })
            .select({ id: 1, comments: 1, date: 1 });
        res.status(200).send({
            data: transaction,
            error: null,
            status: 1,
            message: "Updated Transaction Successfully."
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Updating Transaction."
        })
    }
}