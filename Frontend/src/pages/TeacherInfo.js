import React from 'react';
import Popup from 'reactjs-popup'
import PopupField from './PopupField';
import './TeacherInfo.css'
function TeacherInfo(props){
    return(
        <div className = "box">
            <label id="namelabel">Teacher/Class Info</label>
            <button className="addItem" onChange = {props.addField}>+</button>
            <table className="infoList">
                {props.items.map(item => (
                    <tr>
                        <td id="fieldForTeacher">{item.field}</td>
                        <td>{item.info}</td>
                    </tr>
                    // <li>{item.field + ": " + item.info}</li>
                ))}
            </table>
        </div>
        );
}
// class TeacherInfo extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = props;
//     }
//     render(){
//         return(
//             <div className = "box">
//                 <label id="namelabel">Teacher/Class Info</label>
//                 <Popup trigger = {<button className="addItem" onChange = {this.props.addField}>+</button>}>
//                 <div>This is the popup</div>
//                 </Popup>
//                 <table className="infoList">
//                     {this.props.items.map(item => (
//                         <tr>
//                             <td id="fieldForTeacher">{item.field}</td>
//                             <td>{item.info}</td>
//                         </tr>
//                         // <li>{item.field + ": " + item.info}</li>
//                     ))}
//                 </table>
//             </div>
//             );
//     }
// }
// function TeacherInfo(props){
//     return(
//     <div className = "box">
//         <label id="namelabel">Teacher/Class Info</label>
//         <table className="infoList">
//             {props.items.map(item => (
//                 <tr>
//                     <td id="fieldForTeacher">{item.field}</td>
//                     <td>{item.info}</td>
//                 </tr>
//                 // <li>{item.field + ": " + item.info}</li>
//             ))}
//         </table>
//     </div>
//     );
// }
export default TeacherInfo;