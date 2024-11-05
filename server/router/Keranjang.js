const express = require("express");
const router = express.Router();
const { Keranjang } = require("../models");
const axios = require("axios");
const Sequelize = require("sequelize");


router.get("/byEmailAndId/:email/:idMenu", async (req, res) =>
{
    const email = req.params.email;
    const idMenu = req.params.idMenu;

    const pesanan = await Keranjang.findOne({ where: { email: email, idMenu: idMenu }});

    if (pesanan)
        return res.json({ add: true });

    return res.json({ add: false });
});

router.post("/", async (req, res) =>
{
    const email = req.body.email;
    const idMenu = req.body.idMenu;

    const pesanan = await axios.get(`http://localhost:3001/keranjang/byEmailAndId/${email}/${idMenu}`);

    if (pesanan.data.add)
    {
        await Keranjang.update(
            { jumlah: Sequelize.literal('jumlah + 1') }, // Set token to null
            { where: { email: email, idMenu: idMenu } }
        );

        return res.json({ message: "Add" });
    }
    else
    {
        const order = req.body;

        await Keranjang.create(order);

        return res.json(order);
    } 
});





module.exports = router;