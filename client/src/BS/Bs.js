import React, { useEffect, useState } from "react";
import axios from 'axios';



function Bs(){
    const [data, setData] = useState([]);

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/get/bs?year=2023&month=1',{

     })
        .then(response => {
          setData(response.data);
        //   console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    }, []);

        function data_branch(){
            for(let i = 0;i< data.branches.count;i++){
                return console.log(data[i]);
            }
        }   
    
    return <div className="container p-5">
        <h2 className="fw-bold text-uppercase ">Balance Sheet</h2>
       <div className="mt-5">
            <div className="card shadow p-3 mb-5 bg-body rounded">
               <div className="card-body">
           
               {data.map(item => (
                    <div key={item.COA_num}>
                    <h2>{item.COA_num}</h2>
                    <div>
                
                      {
                       item.branches.map(cabang =>(
                        
                        <div key={cabang.branch_code}>
                            <p>{cabang.branch_code}</p>
                            <p>{cabang.branch_name}</p>
                        </div>
                       ))
                      }
                    </div>
                    </div>
                ))}
               </div>
            </div>
       </div>
    </div>
}

export default Bs;