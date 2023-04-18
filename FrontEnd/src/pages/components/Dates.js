import './Dates.css'

function Dates(props){
    return(
    <div className = "box4">
        <label id="namelabel4">Important Dates</label>
        {/* <button className="addItem" onChange = {props.addField}>+</button> */}
        <table className="table4">
            <tr>
                <td>Week</td>
                <td>Date</td>
                <td>Assignment</td>
                <td>Important Dates</td>
                {/* <td></td>
                <td>Assignment</td>
                <td>Assigned Date</td>
                <td>Due Date</td> */}
                </tr>

           {props.items.map(item => (
            <tr>
                <td id = "weeks">{item.week}</td>
                {/* <td id = "topics">{item.topic}</td> */}
                <td>
                {item.date.map(date1 => (
                    <tr id="dates">{date1}</tr>
                ))}
                </td>
                <td>
                {item.assignment.map(assignment1 => (
                    <tr id="assignments">{assignment1}</tr>
                ))}
                </td>
                <td>
                {item.important.map(important1 => (
                    <tr id="importants">{important1}</tr>
                ))}
                </td>
                {/* {item.topic.map(topic1 => (
                    <tr id="topics">{topic1}</tr>
                ))} */}
                {/* <td id="assignment">{item.assignment}</td>
                <td id="assigned_date">{item.assigned_date}</td>
                <td id="due_date">{item.due_date}</td> */}
                
            </tr>
           ))}
        </table>
    </div>
    );
}
export default Dates;