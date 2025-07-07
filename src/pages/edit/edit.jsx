import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Guardian from "../../compnents/create/Guardian";
import ContractEditor from "../../compnents/create/ContractEditor";
import { useState } from "react";
import Payment from "../../compnents/create/Payment";
import Student from "../../compnents/create/StudentInfo";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";

const API_URL = "http://localhost:3030";
const API_URL2 = process.env.REACT_APP_API_URL;

export default function EditContract() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractYears, setContractYears] = useState([]);
  const [selectedContractYear, setSelectedContractYear] = useState('');

  // Define the initial state for `guardian`
  const [guardian, setGuardian] = useState({
    name: "",
    idNumber: "",
    relationship: "",
    absherMobileNumber: "",
    additionalMobileNumber: "",
    residentialAddress: "",
    profession: "",
    workAddress: "",
    workPhoneNumber: "",
    extension: "",
    contactPersons: [
      {
        name: "",
        relationship: "",
        mobileNumber: "",
      },
      {
        name: "",
        relationship: "",
        mobileNumber: "",
      },
    ],
  });

  // Define the state for `contractEditor`
  const [contractEditor, setContractEditor] = useState({
    name: "",
    idNumber: "",
    relationship: "",
    absherMobileNumber: "",
    additionalMobileNumber: "",
    residentialAddress: "",
    profession: "",
    workAddress: "",
    workPhoneNumber: "",
    extension: "",
  });

  // Define the initial state for `student`
  const [student, setStudent] = useState({
    name: "",
    nationality: "",
    birthPlace: "",
    birthDate: "",
    idNumber: "",
    idIssueDate: "",
    idIssuePlace: "",
    previouslyEnrolled: false,
    previousSchoolName: "",
    previousSchoolCity: "",
    previousSchoolType: "",
    requiredSchool: "",
    requiredStage: "",
    requiredGrade: "",
    hasSiblingsInIthraa: false,
    siblings: [
      {
        name: "",
        school: "",
        stage: "",
        grade: "",
      },
    ],
  });

  // Define the initial state for `payment`
  const [payment, setPayment] = useState({
    paymentType: "Annual", // Default value
    transportation: {
      required: false, // Default value
      neighborhood: "",
      path: "One path", // Default value
    },
  });

  // Format date to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Handle different date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch contract years and current contract data
  useEffect(() => {
    // Fetch available contract years
    const fetchContractYears = async () => {
      try {
        const response = await fetch(`${API_URL2}/api/contract-variables`, {
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch contract years');
        
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format received');
        }

        const years = data.data.map(contract => ({
          id: contract._id,
          year: `${contract.contractYear}_${contract.contractYearHijri}`,
          isActive: contract.isActive
        }));

        setContractYears(years);
      } catch (err) {
        console.error('Error fetching contract years:', err);
        alert('حدث خطأ أثناء جلب السنوات الدراسية');
      }
    };

    // Fetch current contract data
    const fetchContractData = async () => {
      try {
        const response = await fetch(`${API_URL2}/api/admin/get/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          setGuardian(data.data.guardian);
          setContractEditor(data.data.contractEditor);
          const previouslyEnrolled =
            data.data.student.previouslyEnrolled === true ||
            data.data.student.previouslyEnrolled === "true";

          // Format dates for the student data
          const formattedStudentData = {
            ...data.data.student,
            previouslyEnrolled,
            birthDate: formatDateForInput(data.data.student.birthDate),
            idIssueDate: formatDateForInput(data.data.student.idIssueDate)
          };

          setStudent(formattedStudentData);
          setPayment(data.data.payment);
          
          // Set the selected contract year if it exists
          if (data.data.contractYear) {
            setSelectedContractYear(data.data.contractYear);
          }
        } else {
          alert("فشل تحميل بيانات العقد.");
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
        alert("حدث خطأ أثناء تحميل بيانات العقد");
      }
    };

    fetchContractYears();
    fetchContractData();
  }, [id]);

  return (
    <>
      <Header />
      <div dir="rtl" className="container mt-2">
        <h2 className="fw-bold">تعديل عقد تسجيل طالب</h2>
        <hr />

        {/* Contract Year Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>السنة الدراسية للعقد</InputLabel>
            <Select
              value={selectedContractYear}
              onChange={(e) => setSelectedContractYear(e.target.value)}
              label="السنة الدراسية للعقد"
            >
              {contractYears.map((year) => (
                <MenuItem 
                  key={year.id} 
                  value={year.year}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{year.year}</span>
                  {year.isActive && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'success.main',
                        bgcolor: 'success.light',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        mr: 1
                      }}
                    >
                      نشط
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Guardian data={guardian} setData={setGuardian} />
        <hr />
        <ContractEditor data={contractEditor} setData={setContractEditor} />
        <hr />
        <Student data={student} setData={setStudent} />
        <hr />
        <Payment data={payment} setData={setPayment} />
        <div className="text-center w-100">
          <button
            onClick={handleSubmit}
            className="btn btn-success w-75 text-center edit-button"
          >
            تعديل العقد
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  function handleSubmit() {
    if (!selectedContractYear) {
      alert('يرجى اختيار السنة الدراسية للعقد');
      return;
    }

    const requestData = {
      contractYear: selectedContractYear,
      guardian,
      contractEditor,
      student,
      payment,
    };

    fetch(`${API_URL2}/api/admin/edit/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("تم تعديل العقد بنجاح!");
          navigate("/students");
        } else {
          alert(data.message || "حدث خطأ أثناء تعديل العقد.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("تعذر الاتصال بالخادم.");
      });
  }
}
