import Footer from "../../common/Footer";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./sendContract.css";

export default function SendContract() {
  const API_URL = "http://localhost:3030";
  const API_URL2 = process.env.REACT_APP_API_URL;
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(""); // Track which button is loading

  // resivedContractType be pdf or docx
  const resivedContractType = "pdf";

  const location = useLocation();
  const contractEditorName =
    location.state?.contractEditorName || "No Name Provided";

  const contractId = location.state?.contractId || "No Name Provided";

  const validateEmail = (email) => {
    return emailPattern.test(email);
  };

  const handleEmailSend = async () => {
    if (!validateEmail(email)) {
      alert("❌ يرجى إدخال البريد الإلكتروني بطريقة صحيحة");
      return;
    }

    if (!contractId) {
      alert("❌ لم يتم العثور على معرف العقد.");
      return;
    }

    try {
      setLoading(true);
      setLoadingType("email"); // Set loading type

      console.log("📩 Sending contract via email...");
      console.log("📝 Contract Name:", contractEditorName);
      console.log("🆔 Contract ID:", contractId);
      console.log("📧 Recipient Email:", email);
      console.log("📄 Requested File Type:", resivedContractType);

      // Fetch the contract file from backend
      const contractResponse = await fetch(
        `${API_URL2}/api/admin/print/${contractId}?type=${resivedContractType}`
      );

      if (!contractResponse.ok) {
        throw new Error("❌ Failed to fetch contract file");
      }

      const contractBlob = await contractResponse.blob();

      // Determine correct filename based on type
      const contractFileName =
        resivedContractType === "pdf" ? "contract.pdf" : "contract.docx";

      // Create FormData to send the file
      const formData = new FormData();
      formData.append("name", contractEditorName);
      formData.append("email", email);
      formData.append("subject", "Your Contract Details");
      formData.append(
        "message",
        `Dear ${contractEditorName},\n\nHere are the details of the contract. Please review and sign it.`
      );
      formData.append("contractId", contractId);
      formData.append("contractFile", contractBlob, contractFileName); // ✅ Correct file extension

      // Send contract file to backend for email
      const response = await fetch(`${API_URL2}/api/send-email`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log("📨 Email Send Response:", data);

      if (data.success) {
        alert("✅ تم إرسال البريد الإلكتروني بنجاح!");
      } else {
        alert("❌ فشل في إرسال البريد الإلكتروني. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
      setLoadingType(""); // Reset loading type
    }
  };

  const handleWhatsAppSend = async () => {
    if (!whatsapp.startsWith("+")) {
      alert("❌ يرجى إدخال رقم واتساب صحيح بصيغة دولية (مثال: +201234567890)");
      return;
    }

    if (!contractId) {
      alert("❌ لم يتم العثور على معرف العقد.");
      return;
    }

    try {
      setLoading(true);
      setLoadingType("whatsapp"); // Set loading type

      console.log("Preparing contract file...");
      console.log("Contract ID:", contractId);
      console.log("WhatsApp Number:", whatsapp);

      // Fetch the contract file (Frontend generates and sends)
      const contractResponse = await fetch(
        `${API_URL2}/api/admin/print/${contractId}?type=${resivedContractType}`
      );

      if (!contractResponse.ok) {
        throw new Error("Failed to generate contract file");
      }

      const contractBlob = await contractResponse.blob();

      // Create FormData to send the file
      const formData = new FormData();
      formData.append("whatsapp", whatsapp);  
      formData.append("contractId", contractId);
      formData.append("name", contractEditorName);
      const contractFileName =
        resivedContractType === "pdf" ? "contract.pdf" : "contract.docx";
      formData.append("contractFile", contractBlob, contractFileName);

      // Send contract file to backend
      const response = await fetch(`${API_URL2}/api/send-whatsapp`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        alert("✅ تم إرسال العقد عبر واتساب بنجاح!");
      } else {
        alert("❌ فشل في إرسال العقد عبر واتساب. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
      setLoadingType(""); // Reset loading type
    }
  };

  return (
    <div dir="rtl" style={{ textAlign: "center", margin: 0, padding: 0 }}>
      {/* Header Section */}
      <div
        style={{
          backgroundColor: "#0B3D2E",
          color: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={require("../../assets/images/whiteLogo.png")}
          alt="ithra"
          style={{ width: "80px", filter: "brightness(0) invert(1)" }}
        />
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          نبني الإنسان المنتج
        </div>
        <h1 style={{ margin: 0, fontSize: "24px" }}>
          شركة إثراء للتعليم <br /> Ithra Education Company
        </h1>
      </div>

      {/* Form Section */}
      <div style={{ width: "80%", margin: "20px auto", textAlign: "center" }}>
        <h6>
          نأمل تزويدنا برقم الواتس آب للتواصل وكذلك الإيميل وكتابتهما في الخانة
          المخصصة لذلك حتى تتمكنوا من الاطلاع على العقد وتوقيعه شاكرين لكم حسن
          تعاونكم
        </h6>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Input Fields Section */}
          <div
            style={{
              width: "48%",
              background: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "right",
            }}
          >
            <h3>أدخل بياناتك</h3>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\+?\d*$/.test(inputValue)) {
                  // Allow "+" only at the beginning
                  setWhatsapp(inputValue);
                }
              }}
              placeholder="أدخل رقم واتساب: +201234567890"
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 14);
              }}
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
                textAlign: "right",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              style={{
                width: "100%",
                padding: "10px",
                margin: "10px 0",
                border: validateEmail(email)
                  ? "2px solid green"
                  : "2px solid red",
                borderRadius: "5px",
                fontSize: "16px",
                textAlign: "right",
              }}
            />
          </div>

          {/* Video Section */}
          <div style={{ width: "48%", textAlign: "left" }}>
            <video autoPlay muted loop style={{ width: "100%" }}>
              <source src="/assets/images/ithra_video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="button-container">
        {/* Send via Email Button */}
        <button
          onClick={handleEmailSend}
          disabled={loading && loadingType === "email"}
          className={`custom-button email-button ${
            loading && loadingType === "email" ? "loading" : ""
          }`}
        >
          {loading && loadingType === "email"
            ? "⏳ جاري الإرسال..."
            : "📧 إرسال عبر البريد الإلكتروني"}
        </button>

        {/* Send via WhatsApp Button */}
        <button
          onClick={handleWhatsAppSend}
          disabled={loading && loadingType === "whatsapp"}
          className={`custom-button whatsapp-button ${
            loading && loadingType === "whatsapp" ? "loading" : ""
          }`}
        >
          {loading && loadingType === "whatsapp"
            ? "⏳ جاري الإرسال..."
            : "📲 إرسال عبر واتساب"}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <p style={{ color: "green", fontSize: "18px", marginTop: "10px" }}>
          ✅ تم إرسال البيانات بنجاح!
        </p>
      )}

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
