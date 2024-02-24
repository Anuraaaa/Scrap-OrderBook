
import dotenv from 'dotenv';
dotenv.config();

document.addEventListener("DOMContentLoaded", () => {
    console.log("ready")
    const pairParent = document.getElementById('allpair');
    const askParent = document.getElementById('table-ask');
    const bidParent = document.getElementById('table-bid');
    
    const apiPair = `${process.env.API_LOCAL_URL_ALLPAIR}`;
    fetch(apiPair).then(async function (response) {
        if (response.ok) {
            response.json().then(function (data){
                data.map((pair, index) => {
                    const option = document.createElement('option');
                    option.value = pair.symbol;
                    option.textContent = pair.symbol;
                    pairParent.appendChild(option);                      
                })
            })
        }
        else {
            console.log("response not ok")
        }
    })
    
    let wsDepthLastName;
    let ws = -1;
    
    function UpdateData() {
    
        if (ws || ws.readyState == WebSocket.OPEN)
        {    
            ws.onmessage = function(event) {
                let data = JSON.parse(event.data);
                data.a.sort((a, b) => b - a);
                data.a.slice(0, 10).forEach((ask, index) => {
                    
                    if (index < 10)
                    {
                        const existRow = askParent.querySelector(`#depth-row-ask-${index}`);
    
                        if (existRow) {
                            if (ask[1] != 0) {
                                existRow.cells[0].textContent = ask[0];
                                existRow.cells[1].textContent = ask[1];                                
                            }
                        }
                        else {
                            if (ask[1] != 0) {
                                const tRow = document.createElement('tr');
                                tRow.id = `depth-row-ask-${index}`;
                                const tColumn1 = document.createElement('td');                            
                                tColumn1.textContent = ask[0];
                                tColumn1.style = 'background-color: red';
                                tRow.appendChild(tColumn1);
                                const tColumn2 = document.createElement('td');                            
                                tColumn2.textContent = ask[1];
                                tRow.appendChild(tColumn2);
                                askParent.appendChild(tRow); 
                            }
                        }
                    }
                })
                data.b.sort((a, b) => b - a);
                data.b.slice(0, 10).forEach((bid, index) => {
    
                    if (index < 10) {
                        const existRow = bidParent.querySelector(`#depth-row-bid-${index}`);
    
                        if (existRow) {
                            if (bid[1] != 0) {
                                existRow.cells[0].textContent = bid[0];
                                existRow.cells[1].textContent = bid[1];                                
                            }
                        }
                        else {
                            if (bid[1] != 0) {
                                const tRow = document.createElement('tr');
                                tRow.id = `depth-row-bid-${index}`;
                                const tColumn1 = document.createElement('td');                            
                                tColumn1.textContent = bid[0];
                                tColumn1.style = 'background-color: green';
                                tRow.appendChild(tColumn1);
                                const tColumn2 = document.createElement('td');                            
                                tColumn2.textContent = bid[1];
                                tRow.appendChild(tColumn2);
                                bidParent.appendChild(tRow);
                            }
                        }
                    }
                })
            };            
        }
    }
    
    function getSelectValue() {
        const selectValue = pairParent.value;
        wsDepthLastName = selectValue;
        
        if (ws != -1) {
            ws.close();
            askParent.textContent = '';
            bidParent.textContent = '';
            ws = -1;
            ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsDepthLastName.toLowerCase()}@depth`);
            ws.onopen = function() {
                console.log('Connected to WebSocket server');
            };
            UpdateData();
        }
        else
        {
            ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsDepthLastName.toLowerCase()}@depth`);
            ws.onopen = function() {
                console.log('Connected to WebSocket server');
            };
            UpdateData();
        }
        // const apiDepth = `http://localhost:3000/depth/${selectValue}`;
    
        // fetch(apiDepth).then(function (response) {
        //     if (response.ok) {
        //         response.json().then(function (data) { 
        //             askParent.innerHTML = '';
        //             bidParent.innerHTML = '';                       
        //             data.asks.map((ask, index) => {
    
        //                 if (index < 10) {
        //                     const tRow = document.createElement('tr');
        //                     tRow.id = 'depth-row';
        //                     const tColumn1 = document.createElement('td');                            
        //                     tColumn1.textContent = ask[0];
        //                     tRow.appendChild(tColumn1);
        //                     const tColumn2 = document.createElement('td');                            
        //                     tColumn2.textContent = ask[1];
        //                     tRow.appendChild(tColumn2);
        //                     askParent.appendChild(tRow);
        //                 }
        //             })
        //             data.bids.map((bid, index) => {
        //                 if (index < 10) {
        //                     const tRow = document.createElement('tr');
        //                     tRow.id = 'depth-row';
        //                     const tColumn1 = document.createElement('td');                            
        //                     tColumn1.textContent = bid[0];
        //                     tRow.appendChild(tColumn1);
        //                     const tColumn2 = document.createElement('td');                            
        //                     tColumn2.textContent = bid[1];
        //                     tRow.appendChild(tColumn2);
        //                     bidParent.appendChild(tRow);
        //                 }
        //             })
    
        //         })
        //         // setInterval(getSelectValue(), 1000);
        //     } else {
        //         console.log("response not ok");
        //     }
        // })
    }
    // UpdateData();
})

