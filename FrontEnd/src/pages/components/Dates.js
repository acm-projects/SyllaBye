import './Dates.css'

function Dates(props){
    return(
    <div className = "box4">
        <label id="namelabel4">Important Dates</label>
        <button className="addItem" onChange = {props.addField}>+</button>
        <table className="table4">
            <tr>
                <td>Assignment</td>
                <td>Assigned Date</td>
                <td>Due Date</td>
                </tr>

           {props.items.map(item => (
            <tr>
                <td id="assignment">{item.assignment}</td>
                <td id="assigned_date">{item.assigned_date}</td>
                <td id="due_date">{item.due_date}</td>
                
            </tr>
           ))}
        </table>
    </div>
    );
}
export default Dates;