import React, { useEffect, useState } from "react";
import axios from 'axios';



function Bs(){
  
    const [data, setData] = useState([]);

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/get/bs?year=2023&month=1',{

     })
        .then(response => {
        
            setData(response.data);
        //   setData(response.data[1]);
          
        })
        .catch(error => {
          console.log(error);
        });
    }, []);
    // console.log(data)
    return <div className="container p-5">
        <h2 className="fw-bold text-uppercase ">Balance Sheet</h2>
       <div className="mt-5">
            <div className="card shadow p-3 mb-5 bg-body rounded">
                
              {data.map((subitem)=>(
                <div>
                {subitem.map((item)=>(
                
                <div key={item.COA_num} className="card p-3 m-3 shadow p-3  bg-body rounded">
                
                    <div className="d-flex justify-content-between card-title mt-3 ms-4 me-4">
                        <div className="d-flex flex-column ">
                            <div className="fw-bold" style={{fontSize:'20px'}}>{item.COA_name}</div>
                            <div className="text-muted" style={{fontSize:'15px'}}>{item.COA_num}</div> 
                            
                        </div>
                        <div>
                            <p className="text-muted">{item.COA_date}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap justify-content-start card-body">
                    {item.Branches.map((branch)=>(
                    <div className="card p-2 m-2" style={{width:'200px'}}>
                        <div className="d-flex flex-column">
                        <div className="fw-bold" style={{fontSize:'15px'}}>{branch.branch_name}</div>
                          <div className="" style={{fontSize:'10px'}}>{branch.branch_code}</div>                
                          
                        </div>
                        <div style={{fontSize:'20px'}}>
                            Rp. {branch.value}
                        </div>
                    </div>
                    ))}
                   </div>
                </div>
               ))}
                </div>
              ))}
               
               
            </div>
       </div>
    </div>
}

export default Bs;