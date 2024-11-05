import axios from 'axios';
import React, { useEffect, useState } from 'react';

function PesananSection() {
    const publicUrl = process.env.PUBLIC_URL + '/images/menu/';
    const [listOfPesanan, setListOfPesanan] = useState([]);
    const [activePesanan, setActivePesanan] = useState(null);
    const [pesananItems, setPesananItems] = useState({});
    const [codePesanan, setCodePesanan] = useState("");

    // Mengambil daftar pesanan pada saat komponen dimuat
    useEffect(() => {
        axios.get("http://localhost:3001/daftarPesanan").then((response) => {
            setListOfPesanan(response.data);
        }).catch((error) => {
            console.error("Error fetching daftarPesanan:", error);
        });
    }, []);

    const handleSearch = (() =>
    {
        if (codePesanan === "")
        {
            axios.get("http://localhost:3001/daftarPesanan").then((response) =>
            {
                setListOfPesanan(response.data);
            });
        }
        else
        {
            axios.get(`http://localhost:3001/daftarPesanan/byUniqueCode/${codePesanan}`).then((response) =>
            {
                setListOfPesanan(response.data);
            });
        }
    });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // Fungsi untuk membuka/tutup detail pesanan dan mengambil item pesanan jika belum ada di state
    const togglePesanan = (idPesanan) => {
        if (activePesanan === idPesanan) {
            setActivePesanan(null);
        } else {
            setActivePesanan(idPesanan);
            if (!pesananItems[idPesanan]) {
                axios.get(`http://localhost:3001/itemPesanan/byIdPesanan/${idPesanan}`)
                    .then((response) => {
                        const items = response.data;

                        // Ambil detail menu untuk setiap item pesanan
                        const itemPromises = items.map((item) => {
                            return axios.get(`http://localhost:3001/daftarMenu/byId/${item.idMenu}`)
                                .then((menuResponse) => ({
                                    ...item,
                                    menu: menuResponse.data,
                                }));
                        });

                        // Tunggu semua data item pesanan selesai diambil
                        Promise.all(itemPromises).then((itemsWithMenu) => {
                            setPesananItems((prevItems) => ({
                                ...prevItems,
                                [idPesanan]: itemsWithMenu,
                            }));
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching itemPesanan:", error);
                    });
            }
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    return (
        <div className='pesananSectionContainerWrapper'>
            {listOfPesanan.map((pesanan, key) => {
                const listOfItemPesanan = pesananItems[pesanan.idPesanan] || [];
                const totalHarga = listOfItemPesanan.reduce(
                    (acc, item) => acc + (item.menu.harga * item.jumlah), 0
                );

                return (
                    <div className='pesananSectionContainer' key={key}>
                        <div className='pesananOnlineBox'>
                            <div className='detail'>
                                <h1> {pesanan.uniqueCode} </h1>
                                <p onClick={() => togglePesanan(pesanan.idPesanan)}> Lihat selengkapnya </p>
                            </div>
                            <p onClick={() => togglePesanan(pesanan.idPesanan)}>
                                <i className={`fa-solid fa-caret-${activePesanan === pesanan.idPesanan ? 'down' : 'up'}`}></i>
                            </p>
                        </div>
                        {activePesanan === pesanan.idPesanan && (
                            <div className="pesananOnlineBoxMore">
                                <div className='tabelPesanan'>
                                    <div className='menuWrapper'>
                                        {listOfItemPesanan.map((item, index) => (
                                            <div className='pesananBox' key={index}>
                                                <img src={publicUrl + item.menu.gambar} alt='menu' />
                                                <div className='infoPesanan'>
                                                    <h1> {item.menu.namaMenu} </h1>
                                                    <p> Rp. {item.menu.harga} </p>
                                                </div>
                                                <p> {item.jumlah}x </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='detailPelanggan'>
                                        <h1> Pesanan </h1>
                                        <p> Nama pemesan: {pesanan.namaPemesan} </p>
                                    </div>
                                </div>
                                <div className='detailHarga'>
                                    <h1> Total Harga </h1>
                                    <p> {formatRupiah(totalHarga)} </p>
                                    <button> Check Out </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className='searchBar'>
                <input 
                    type='text' 
                    placeholder='Search...' 
                    name='menu'
                    value={codePesanan}
                    onChange=
                    {
                        (event) => {setCodePesanan(event.target.value)}
                    } 
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}

export default PesananSection;
