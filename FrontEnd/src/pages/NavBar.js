import './NavBar.css'
// import ClassButton from './ClassButton'
function NavBar(props){
    
    return(
        <div className = "navBar">
            <div className="userInfo">
            <img src = "backgroundimage.jpg" id = "pfp"></img>
            <label id="nameuser">{props.username}</label>
            </div>
        <table className = "classList">
            {props.items.map((item,i) => (
            <tr>
                <td id = "tabledet"><input className = "buttonForClassChange" id = {i} type = "submit" value = {item} onClick={props.changeClass}/></td>
            </tr>
        ))}
        </table>
        </div>
    );
}
export default NavBar;