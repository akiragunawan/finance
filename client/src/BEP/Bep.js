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
      
      <ul class="nav nav-tabs" id="myTab" role="tablist">
      {data.map((item)=>(
           <li class="nav-item" role="presentation">
           <button class="nav-link" id="home-tab" data-bs-toggle="tab" data-bs-target="{}" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">{item.Nama_Cabang}</button>
         </li>
         
          ))}
 

</ul>
<div class="tab-content" id="myTabContent">
  {data.map((items)=>(
    
  <div class="tab-pane fade show active" id='home-tab-pane' role="tabpanel" aria-labelledby="home-tab" tabindex="0">...</div>
  
  ))}
</div>
    </div>)
}

export default Bep;