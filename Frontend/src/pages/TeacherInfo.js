import './TeacherInfo.css'
function TeacherInfo(props){
    return(
    <div className = "box">
        <label id="namelabel">Teacher/Class Info</label>
        <ul className="infoList">
            <li>Name: {props.name}</li>
            <li>Email: {props.email}</li>
            <li>Class times: {props.classTimes}</li>
            <li>Office hours: {props.officeHours}</li>
            <li>Classroom: {props.classroom}</li>
        </ul>
    </div>
    );
}
export default TeacherInfo;