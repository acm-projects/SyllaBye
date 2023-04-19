import './GradeDistribution.css'

function GradeDistribution(props){
    var arr = props.items;
    var duplicateNeeded = [];
    var index = 0;
    while(index < arr.length){
        duplicateNeeded.push({field: arr[index], weight: arr[index+1]});
        index = index + 2;
    }
    // {arr.map((item, index) => {
    //     if(index % 2 == 0){
    //         duplicateNeeded.push({field: item, weight: arr[index+1]});
    //     }
    // })}

    return(
    <div className = "box3">
        <label id="namelabel3">Grade Distribution</label>
        {/* <button className="addItem" onChange = {props.addField}>+</button> */}
        <table className = "table3">
           {duplicateNeeded.map(item => (
            <tr>
                {/* <label>{item.field}</label>
                <label>{item.weight}</label> */}
                <td id="fieldForDist">{item.field}</td>
                <td>{item.weight}</td>
            </tr>
           ))}
        </table>
    </div>
    );
}
export default GradeDistribution;