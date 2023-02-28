import React from "react";

function Bs(){
    return <div className="container p-5">
        <h2 className="fw-bold text-uppercase ">Balance Sheet</h2>
       <div className="mt-5">
            <div className="card shadow p-3 mb-5 bg-body rounded">
               <div className="card-body">
                Search Parameter
                <div>
                {/* <label for="basic-url" class="form-label">Your vanity URL</label> */}
                    <div class="input-group mb-3 mt-3">
                        <span class="input-group-text" id="basic-addon3">COA</span>
                        <input type="tex
                        t" class="form-control" id="basic-url" aria-describedby="basic-addon3"/>
                    </div>
                    <div class="input-group mb-3 mt-3">
                        <span class="input-group-text" id="basic-addon3">Month - Year</span>
                        <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3"/>
                    </div>
                </div>
               </div>
            </div>
       </div>
    </div>
}

export default Bs;