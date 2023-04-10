import './ClassButton.css'

function ClassButton(props){
    return(
        <input id = "details" type = "submit" value = {props.name}/>
    );
}
export default ClassButton;