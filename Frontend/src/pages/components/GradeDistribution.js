import './GradeDistribution.css'

function GradeDistribution(props){
    return(
    <div className = "box3">
        <label id="namelabel3">Grade Distribution</label>
        <table className = "table3">
           {props.items.map(item => (
            <tr>
                <td id="fieldForDist">{item.field}</td>
                <td>{item.weight}</td>
            </tr>
           ))}
        </table>
    </div>
    );
}
export default GradeDistribution;