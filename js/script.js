const tbody = document.getElementsByTagName('tbody')[0];
const form = document.getElementsByTagName('form')[0];
const text = document.getElementById('text');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formInput = document.getElementsByTagName('input');
    let ipGiven = formInput[0].value.toString();
    let p = parseInt(formInput[1].value),
        host = parseInt(formInput[2].value) +2;

    let ip = ipGiven.split('.'); 
    
    let table = [];
    let counter = 0, bin = 16, onBits = p - 16;
    for(let i = 0; i < bin; i++){
        table.push({
                    host: Math.pow(2, i), 
                    subnet:(255 - Math.pow(2, counter))+1,
                    increment: Math.pow(2, counter),
                    prefix: i >= 2 ? 30-(i-2) : 0,
                    bin: 0
                });

        counter++;
        if(counter === 8) counter = 0;
    }

    //console.table(table);

    let loc = 0, m = 0;
    for(let i = 0; i < bin; i++){
        if(table[i].host > host){
            loc = i;
            break;
        }
        m++;
    }
    let n = 16 - (onBits + m);


    let subnet = p === 16 || p === 17 ? table[loc].subnet : table[loc-onBits+1].subnet;
    let b = parseInt(ip[2]), c = parseInt(ip[3]);

    text.innerHTML = 'Default Subnet:' + '255.255.255.' + table[loc].increment 
                        +'<br>Subnet : ' + '255.255.' + subnet+ '.0<br>'+
                        'Increment: ' + table[loc].increment
                        + 'On bits: ' + onBits;

    //run test
    let validate = false;
    for(let i = c; i <= 255; i += table[loc].increment){
        if (i == table[loc].subnet) {
            validate = true;
            break;
        }
    }
    
    let networdAdrr = [], hostAddrN = [], hostAddrB = [], threeIp = [];
    let brodCastAdd = 0, row = 0;
    for (let i = b; i <= 255; ) {
        
        if(c == 0){
            hostAddrB.push(255-1);
        }
        hostAddrN.push(ip[0]+'.'+ip[1]+'.'+ i+'.'+(c+1));
        networdAdrr.push(c);

        threeIp.push(ip[0]+'.'+ip[1]+'.'+ i +'.');
        c += table[loc].increment; 
        hostAddrB.push(c-2);
        if(validate){
            networdAdrr.push(c);
            hostAddrN.push(ip[0]+'.'+ip[1]+'.'+ i+'.'+(c+1));
            threeIp.push(ip[0]+'.'+ip[1]+'.'+ i +'.');
            if (c == table[loc].subnet) {
                c = parseInt(ip[3]);
                i++;
            }
        }else{
            if (c > table[loc].subnet) {
                c = 0;
                i++;
            }
        }
    }
    if(c == 0 || c > table[loc].subnet){
        networdAdrr.push(256);
    }else{
        c += table[loc].increment;
        networdAdrr.push(c);
    }
    
    for(let i = 0; i < networdAdrr.length-1; i++){
        let newRow = tbody.insertRow(i);

        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);

        cell1.innerHTML = threeIp[i] + networdAdrr[i];
        cell2.innerHTML = hostAddrN[i];
        if(networdAdrr[i+1] == 0){
            cell3.innerHTML = threeIp[i+1] + 254;
            cell4.innerHTML = threeIp[i+1] + 255;
        }else{
            cell3.innerHTML = threeIp[i] + (networdAdrr[i+1]-2);
            cell4.innerHTML = threeIp[i] + (networdAdrr[i+1]-1);
        }   

        //cell3.innerHTML = threeIp[i] + hostAddrB[i+1];
        //cell4.innerHTML = threeIp[i] + (hostAddrB[i+1]+1);
    }

});
