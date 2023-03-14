import TeacherInfo from "./TeacherInfo";
import Grades from "./Grades";
import './FileDetails.css';
import GradeDistribution from "./GradeDistribution";
import Dates from "./Dates";
function FileDetails(){
    return(
        <div className="page">
    <div className = "firstrow">
        <TeacherInfo name = "Rahul Karthik" email = "karthikrahul444@gmail.com" classTimes = "Tuesday & Thursday, 8:30am - 9:45am" officeHours = "4:00-5:15" classroom = "ECSS 2.410" />
        <Grades />
    </div>
    <div className = "secondrow">
        <GradeDistribution />
        <Dates />
    </div>
    </div>
    );
}
export default FileDetails;