//import { blue } from '@mui/material/colors';
import {useState} from 'react'
import './NavBar.css'
// import ClassButton from './ClassButton'
function NavBar(props){
    var classNames = [];
    console.log("Length" + props.items.length);
    for(var i = 0; i < props.classNm.length; i++){
        console.log(props.classNm[i]);
    }
    const [classNamess, setClassNamess] = useState(classNames);
    function whenClicked(e){
        props.changeClass(e);
       // e.target.className = "clickedButton";
        //  classNames = [];
        
        // for(var i = 0; i < props.items.length; i++){
        //     if(i == e.target.id){
        //         classNames.push("clickedButton");
        //     }
        //     else{
        //         classNames.push("buttonForClassChange");
        //     }
        // }
        // setClassNamess(classNames);
    }
    return(
        <div className = "navBar">
            <div className="userInfo">
            <label id="nameuser">{props.username}'s Classes</label>
            </div>
        <table className = "classList">
            {/* {buttons.map(button => {
                <tr>
                <td id = "tabledet">{button}</td>
            </tr>
            })} */}
            
            {props.items.map((item,i) => (
            <tr>
                <td id = "tabledet"><input id = {i} className = {props.classNm[i].name} type = "submit" value = {item} onClick={whenClicked} /></td>
            </tr>
        ))}
        </table>
        </div>
    );
}
export default NavBar;