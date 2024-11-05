module.exports = (sequelize, DataTypes) =>
{
    const RiwayatTransaksi = sequelize.define("RiwayatTransaksi",
    {
        idPesanan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        idAdmin:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        totalHarga:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });


    
    return RiwayatTransaksi;
}