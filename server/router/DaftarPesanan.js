const express = require("express");
const router = express.Router();
const { DaftarPesanan } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) =>
{
    const listOfPesanan = await DaftarPesanan.findAll();

    res.json(listOfPesanan);
});
router.get("/byUniqueCode/:uniqueCode", async (req, res) =>
{
    const uniqueCode = req.params.uniqueCode;

    const listOfPesanan = await DaftarPesanan.findAll(
    {
        where:
        {
            uniqueCode: 
            {
                [Op.like]: `%${uniqueCode}%`
            }
        }
    });

    res.json(listOfPesanan);
});


router.post("/", async (req, res) =>
{
    const pesanan = req.body;

    await DaftarPesanan.create(pesanan);

    res.json(pesanan);
});



module.exports = router;