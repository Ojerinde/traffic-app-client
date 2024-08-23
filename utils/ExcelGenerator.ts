import * as XLSX from "xlsx";

export const createExcelFile = (students: any, modifiedCourseCode: string) => {
  const data = [];

  // Add header for students below or equal to 50% attendance
  data.push([
    "",
    "STUDENTS WITH 50% AND LESS ATTENDANCE",
    "",
    ""
  ]);

  // Add sub-headers for below or equal to 50% students
  data.push([
    "SN",
    "Name",
    "Matric No",
    "Attendance Percentage"
  ]);

  if (students.belowOrEqualFiftyPercent.length > 0) {
    students.belowOrEqualFiftyPercent.forEach((student: any, index: number) => {
      data.push([
        index + 1,
        student.student.name,
        student.student.matricNo,
        student.attendancePercentage + "%"
      ]);
    });
  }

  // Add empty row
  data.push([
    "",
    "",
    "",
    ""
  ]);

  // Add header for students above 50% attendance
  data.push([
    "",
    "STUDENTS WITH ABOVE 50% ATTENDANCE",
    "",
    ""
  ]);

  // Add sub-headers for above 50% students
  data.push([
    "SN",
    "Name",
    "Matric No",
    "Attendance Percentage"
  ]);

  if (students.aboveFiftyPercent.length > 0) {
    students.aboveFiftyPercent.forEach((student: any, index: number) => {
      data.push([
        index + 1,
        student.student.name,
        student.student.matricNo,
        student.attendancePercentage + "%"
      ]);
    });
  }

  // Create the worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    `Report for ${modifiedCourseCode}`
  );

  // Write the workbook to a buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  return excelBuffer;
};
