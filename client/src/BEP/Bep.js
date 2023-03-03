import React, { useEffect, useState } from "react";
import axios from 'axios';



function Bep(){

    const [data, setData] = useState([]);
    

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/get/bep?year=2023&month=1',{

     })
        .then(response => {
            setData(response.data);

        })
        .catch(error => {
          console.log(error);
        });
    }, []);
   
    return (
    <div className="container">
        <div className="row">
          {data.map((item)=>(
            <div key={item.kode} className="col-3">
              <div className="card">
                {item.nama_cabang}
              </div>
            </div>
          ))}
        </div>
    </div>)
}

export default Bep;