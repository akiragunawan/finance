import React, { useEffect, useState } from "react";
import axios from 'axios';
import XLSX from 'xlsx';


function Bep(){

    const [data, setData] = useState([]);
    
    var j = 
    [
        { name: "George Washington", birthday: [1,2,3,4] },
        

      ]
      const [ws,setWs] = useState([]);
  
    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/get/bep?year=2023&month=1',{

     })
        .then(response => {
            setData(response.data);
            const worksheet = XLSX.utils.json_to_sheet(j);
            const workbook = XLSX.utils.book_new();
            setWs(XLSX.utils.sheet_to(worksheet))
            // XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
            // XLSX.writeFile(workbook, "Presidents.xlsx", { compression: true });
        })
        .catch(error => {
          console.log(error);
        });
    }, []);
   
    return (
    <div className="container">
        
    </div>)
}

export default Bep;