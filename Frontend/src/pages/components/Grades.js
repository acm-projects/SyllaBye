import './Grades.css'

function Grades(props){
    return(
    <div className = "box2">
        <label id="namelabel2">Grades</label>
           {props.items.map(item => (
           <table className="tables">
                {item.map(realitem => (
                    <tr>
                        <td className="range">{realitem.range}</td>
                        <td className="grades">{realitem.grade}</td>
                    </tr>
                ))}
           </table>
            
           ))}
    </div>
    );
}
export default Grades;