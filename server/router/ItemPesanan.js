const express = require("express");
const router = express.Router();
const { ItemPesanan } = require("../models");


router.get("/byIdPesanan/:idPesanan", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;
    const listOfItemPesanan = await ItemPesanan.findAll(
    {
        where:
        {
            idPesanan: idPesanan
        }
    });

    res.json(listOfItemPesanan);
});

router.post("/", async (req, res) =>
{
    const pesanan = req.body;

    await ItemPesanan.create(pesanan);

    res.json(pesanan);
});



module.exports = router;