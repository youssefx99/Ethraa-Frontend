import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Guardian from "../../compnents/create/Guardian";
import ContractEditor from "../../compnents/create/ContractEditor";
import { useEffect, useState } from "react";
import Payment from "../../compnents/create/Payment";
import Student from "../../compnents/create/StudentInfo";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";

const API_URL = "http://localhost:3030";
const API_URL2 = process.env.REACT_APP_API_URL;

export default function Create() {
  const navigate = useNavigate();
  const [contractYears, setContractYears] = useState([]);
  const [selectedContractYear, setSelectedContractYear] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL2}/api/auth-check`, {
          credentials: 'include'
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch contract years on component mount
  useEffect(() => {
    fetchContractYears();
  }, []);

  // Fetch available contract years
  const fetchContractYears = async () => {
    try {
      const response = await fetch(`${API_URL2}/api/contract-variables`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contract years');
      }
      
      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received');
      }

      // Get all contracts without filtering by active status
      const years = data.data.map(contract => {
        const yearString = `${contract.contractYear}_${contract.contractYearHijri}`;
        return {
          id: contract._id,
          year: yearString,
          isActive: contract.isActive // Keep track of active status for display
        };
      });

      setContractYears(years);

      // If user is not authenticated, automatically select the latest contract year
      if (!isAuthenticated && years.length > 0) {
        // Sort years to get the latest one
        const sortedYears = [...years].sort((a, b) => {
          const [aYear] = a.year.split('_');
          const [bYear] = b.year.split('_');
          return bYear.localeCompare(aYear);
        });
        setSelectedContractYear(sortedYears[0].year);
      }
    } catch (err) {
      alert('حدث خطأ أثناء جلب السنوات الدراسية');
    }
  };

  // Define the initial state for `guardian`
  const [guardian, setGuardian] = useState(
    () =>
      loadFromLocalStorage("guardian") || {
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
      }
  );

  // Define the state for `contractEditor`
  const [contractEditor, setContractEditor] = useState(
    () =>
      loadFromLocalStorage("contractEditor") || {
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
      }
  );

  // Define the initial state for `student`
  const [student, setStudent] = useState(
    () =>
      loadFromLocalStorage("student") || {
        name: "",
        nationality: "",
        birthPlace: "",
        birthDate: "",
        idNumber: "",
        idIssueDate: "",
        idIssuePlace: "",
        previouslyEnrolled: null,
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
      }
  );

  // Define the initial state for `payment`
  const [payment, setPayment] = useState(
    () =>
      loadFromLocalStorage("payment") || {
        paymentType: "", // Default value
        transportation: {
          required: false, // Default value
          neighborhood: "",
          path: "", // Default value
        },
      }
  );

  // Add contract year to the initial state
  const [contractData, setContractData] = useState(() => 
    loadFromLocalStorage("contractData") || {
      contractYear: ""
    }
  );

  // Automatically save data when there's a change
  useEffect(() => {
    saveToLocalStorage("guardian", guardian);
  }, [guardian]);

  useEffect(() => {
    saveToLocalStorage("contractEditor", contractEditor);
  }, [contractEditor]);

  useEffect(() => {
    saveToLocalStorage("student", student);
  }, [student]);

  useEffect(() => {
    saveToLocalStorage("payment", payment);
  }, [payment]);

  useEffect(() => {
    saveToLocalStorage("contractData", contractData);
  }, [contractData]);

  return (
    <>
      <Header />
      <div dir="rtl" className="container mt-2">
        <h2 className="fw-bold">عقد تسجيل طالب</h2>
        <hr />

        <form onSubmit={handleSubmit} noValidate>
          {/* Contract Year Selection - Only show if authenticated */}
          {isAuthenticated && (
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
          )}

          <Guardian data={guardian} setData={setGuardian} />
          <hr />
          <ContractEditor data={contractEditor} setData={setContractEditor} />
          <hr />
          <Student data={student} setData={setStudent} />
          <hr />
          <Payment data={payment} setData={setPayment} />
          <div className="text-center w-100">
            <button type="submit" className="btn btn-success w-75 text-center">
              حفظ العقد
            </button>
          </div>
        </form>
        <div className="text-center mt-3 w-100">
          <button
            onClick={clearAllFields}
            className="btn btn-danger w-75 text-center"
          >
            حذف الكل
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  // Save data to localStorage
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Load data from localStorage
  function loadFromLocalStorage(key) {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }

  function validateRequiredFields() {
    const requiredFields = document.querySelectorAll("[required]");
    for (let field of requiredFields) {
      if (!field.value || field.value.trim() === "") {
        const label = field
          .closest(".form-group")
          ?.querySelector("label")?.innerText;

        alert(`يرجى ملء الحقل المطلوب: ${label || "حقل غير معروف"}`);

        field.focus(); // Focus on the missing field
        return false; // Stop checking after the first error
      }
    }

    return true; // All fields are filled
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateRequiredFields()) {
      return;
    }

    // Only check for selectedContractYear if user is authenticated
    if (isAuthenticated && !selectedContractYear) {
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

    fetch(`${API_URL2}/api/user/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Clear localStorage after successful submission
        localStorage.removeItem("guardian");
        localStorage.removeItem("contractEditor");
        localStorage.removeItem("student");
        localStorage.removeItem("payment");
        localStorage.removeItem("contractData");
        
        // Navigate to success page or show success message
        navigate("/students");
      })
      .catch((error) => {
        alert("حدث خطأ أثناء حفظ العقد");
      });
  }

  function clearAllFields() {
    // Clear all form data
    setGuardian({
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
        { name: "", relationship: "", mobileNumber: "" },
        { name: "", relationship: "", mobileNumber: "" },
      ],
    });
    setContractEditor({
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
    setStudent({
      name: "",
      nationality: "",
      birthPlace: "",
      birthDate: "",
      idNumber: "",
      idIssueDate: "",
      idIssuePlace: "",
      previouslyEnrolled: null,
      requiredSchool: "",
      requiredStage: "",
      requiredGrade: "",
      hasSiblingsInIthraa: false,
      siblings: [{ name: "", school: "", stage: "", grade: "" }],
    });
    setPayment({
      paymentType: "",
      transportation: {
        required: false,
        neighborhood: "",
        path: "",
      },
    });
    setSelectedContractYear('');
    
    // Clear localStorage
    localStorage.removeItem("guardian");
    localStorage.removeItem("contractEditor");
    localStorage.removeItem("student");
    localStorage.removeItem("payment");
    localStorage.removeItem("contractData");
  }
}
