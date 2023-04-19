import './Description.css'

function Description(props){
    return(
    <div className = "box2">
        <label id="namelabel2">Course Description</label>
        {/* <button className="addItem" onChange = {props.addField}>+</button> */}
        {/* <table className="tables">
           {props.items.map(item => (
                    <tr>
                        <td className="range">{item.range}</td>
                        <td className="grades">{item.grade}</td>
                    </tr>
           ))}
        </table> */}
        {/* <label id="description">{props.items}</label> */}
        <p>
            {props.items}
        </p>
    </div>
    );
}
export default Description;