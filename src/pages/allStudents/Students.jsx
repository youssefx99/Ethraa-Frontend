import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useNavigate } from "react-router-dom";

const API_URL2 = process.env.REACT_APP_API_URL;

const Students = () => {
  // State for search query, selected column, table data, and user role
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("guardianName");
  const [tableData, setTableData] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printingContractId, setPrintingContractId] = useState(null);
  const navigate = useNavigate();

  // Check authentication and get user role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL2}/api/auth-check`, {
          method: "GET",
          credentials: "include", // Include cookies
        });

        const data = await response.json();

        if (data.success) {
          setUserRole(data.user.role);
        } else {
          // Redirect to login if not authenticated
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch contracts data
  useEffect(() => {
    if (userRole) {
      fetchContracts();
    }
  }, [userRole]);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_URL2}/api/admin/ViewContarcts`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (data.success) {
        const formattedData = data.data.map((contract) => ({
          _id: contract._id,
          guardianName: contract.guardian.name,
          guardianId: contract.guardian.idNumber,
          relationship: contract.guardian.relationship,
          registeredPhone: contract.guardian.absherMobileNumber,
          otherPhone: contract.guardian.additionalMobileNumber,
          address: contract.guardian.residentialAddress,
          contractEditor: contract.contractEditor.name,
          editorId: contract.contractEditor.idNumber,
          studentName: contract.student.name,
          studentId: contract.student.idNumber,
        }));
        setTableData(formattedData);
      } else {
        console.error("Failed to fetch contracts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  };

  // Filter data based on search query and selected column
  const filteredData = tableData.filter((item) =>
    String(item[selectedColumn])
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/edit-contract/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا العقد؟")) {
      try {
        const response = await fetch(`${API_URL2}/api/admin/delete/${id}`, {
          method: "DELETE",
          credentials: "include", // Include cookies for authentication
        });

        const data = await response.json();

        if (data.success) {
          setTableData(tableData.filter((contract) => contract._id !== id));
          alert("تم حذف العقد بنجاح!");
        } else {
          alert(`فشل حذف العقد: ${data.message}`);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("خطأ في الاتصال بالخادم.");
      }
    }
  };

  const handlePrint = async (id) => {
    try {
      // Show floating loader
      setIsPrinting(true);
      setPrintingContractId(id);

      const response = await fetch(`${API_URL2}/api/admin/print/${id}`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error message:", errorData.message);
        throw new Error(errorData.message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `contract-${id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading contract:", error);
      alert(`Failed to download the contract. Error: ${error.message}`);
    } finally {
      // Hide floating loader
      setIsPrinting(false);
      setPrintingContractId(null);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">جاري التحقق من الصلاحيات...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div dir="rtl" className="container mt-5">
        {/* Header */}
        <h1 className="text-center mb-4">قائمة عقود التسجيل للطلاب</h1>

        {/* Action Buttons - Show based on user role */}
        <div className="mb-4">
          {/* Super Admin Only Buttons */}
          {userRole === "super_admin" && (
            <>
              <button
                className="btn btn-primary me-2"
                onClick={() => navigate("/create")}
              >
                + انشاء جديد
              </button>

              <button
                className="btn btn-success me-2"
                onClick={() => navigate("/create-admin")}
              >
                ادارة المديرين
              </button>

              <button
                className="btn btn-danger me-2"
                onClick={() => navigate("/edit-contract-content")}
              >
                ادارة العقود
              </button>
            </>
          )}
        </div>

        {/* Search Field */}
        <div className="d-flex mb-4 gap-1 justify-content-start">
          <input
            type="text"
            className="form-control w-50"
            placeholder="ابحث في الجدول"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-control w-25"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="guardianName">اسم ولى الامر</option>
            <option value="guardianId">رقم الهوية/الاقامة (ولى الامر)</option>
            <option value="relationship">صله القرابة</option>
            <option value="registeredPhone">رقم الجوال المسجل فـي أبشر</option>
            <option value="otherPhone">رقم جوال اخر</option>
            <option value="address">العنوان</option>
            <option value="contractEditor">اسم محرر العقد</option>
            <option value="editorId">رقم هويه/الاقامه لمحرر العقد</option>
            <option value="studentName">اسم الطالب</option>
            <option value="studentId">رقم هويه/الاقامة للطالب</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>اسم ولى الامر</th>
                <th>رقم الهوية/الاقامة (ولى الامر)</th>
                <th>صله القرابة</th>
                <th>رقم الجوال المسجل فـي أبشر</th>
                <th>رقم جوال اخر</th>
                <th>العنوان</th>
                <th>اسم محرر العقد</th>
                <th>رقم هويه/الاقامه لمحرر العقد</th>
                <th>اسم الطالب</th>
                <th>رقم هويه/الاقامة للطالب</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((student, index) => (
                  <tr key={student._id || index}>
                    <td>{student.guardianName}</td>
                    <td>{student.guardianId}</td>
                    <td>{student.relationship}</td>
                    <td>{student.registeredPhone}</td>
                    <td>{student.otherPhone}</td>
                    <td>{student.address}</td>
                    <td>{student.contractEditor}</td>
                    <td>{student.editorId}</td>
                    <td>{student.studentName}</td>
                    <td>{student.studentId}</td>
                    <td>
                      {/* Super Admin Only Buttons */}
                      {userRole === "super_admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(student._id)}
                            className="btn btn-warning me-1"
                            style={{
                              fontSize: "10px",
                              width: "90px",
                              margin: "1px",
                              height: "20px",
                              lineHeight: "1",
                            }}
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="btn btn-danger me-1"
                            style={{
                              margin: "1px",
                              width: "90px",
                              height: "20px",
                              fontSize: "10px",
                              lineHeight: "1",
                            }}
                          >
                            حذف
                          </button>
                        </>
                      )}

                      {/* Print Button - Available for both roles */}
                      <button
                        onClick={() => handlePrint(student._id)}
                        className="btn btn-primary"
                        disabled={isPrinting}
                        style={{
                          margin: "1px",
                          width: "90px",
                          height: "20px",
                          fontSize: "10px",
                          lineHeight: "1",
                        }}
                      >
                        طباعة
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    لا توجد بيانات مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Print Loader */}
      {isPrinting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "30px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mb-2" style={{ color: "#0B3D2E" }}>
              جاري إنشاء العقد...
            </h5>
            <p className="text-muted mb-0">
              يرجى الانتظار بينما نقوم بإنشاء وتحميل العقد
            </p>
            {printingContractId && (
              <small className="text-muted d-block mt-2">
                رقم العقد: {printingContractId}
              </small>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Students;
