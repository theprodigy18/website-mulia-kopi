const express = require("express");
const router = express.Router();
const { DaftarMenu } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) =>
{
    const listOfMenu = await DaftarMenu.findAll();

    res.json(listOfMenu);
});
router.get("/:category", async (req, res) =>
{
    const category = req.params.category;

    const listOfMenu = await DaftarMenu.findAll(
    {
        where:
        {
            kategori: category
        }
    });

    res.json(listOfMenu);
});
router.get("/byId/:idMenu", async (req, res) =>
{
    const idMenu = req.params.idMenu;

    const menu = await DaftarMenu.findByPk(idMenu);

    res.json(menu);
});
router.get("/byName/:name", async (req, res) =>
{
    const menuName = req.params.name;
    const listOfMenu = await DaftarMenu.findAll(
    {
        where:
        {
            namaMenu: 
            {
                [Op.like]: `%${menuName}%`
            }
        }
    })

    res.json(listOfMenu);
});

router.post("/", async (req, res) =>
{
    const menu = req.body;
    await DaftarMenu.create(menu);

    res.json(menu);
});



module.exports = router;