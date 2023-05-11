import adminpages from './admin';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //
const username = localStorage.getItem('username');


const array = []

if(username === "admin"){
    array.push(adminpages)
    const menuItems = {        
        items: array
    };
}else{   
    array.push(other)
    const menuItems = {        
        items: array
    };
}

const menuItems = {
    items: array
};

export default menuItems;