import React from "react";
import './Switch.css';



const aaa = () => {

}

const Switch = (params) => {
    console.log(params);

    function onchange(){
        console.log('onch');
    }

    const checked = (params.checked) ? 'checked' : '';
    // console.log(checked);
    if(checked.length){
        return (
            <label className="switch">
               <input type="checkbox" checked="checked" onClick="onchange" />
                <span className="slider round" />
            </label>
        );
    }else{
        return (
            <label className="switch">
               <input type="checkbox"  />
                <span className="slider round" onChange="onchange" />
            </label>
        );
    }
    
};

export default Switch;
