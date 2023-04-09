import './Grades.css'

function Grades(props){
    return(
    <div className = "box2">
        <label id="namelabel2">Grades</label>
        <button className="addItem" onChange = {props.addField}>+</button>
        <table className="tables">
           {props.items.map(item => (
                    <tr>
                        <td className="range">{item.range}</td>
                        <td className="grades">{item.grade}</td>
                    </tr>
            
           ))}
           </table>
    </div>
    );
}
export default Grades;