import Footer from "../../common/Footer";
// import Header from "../../common/Header";
import "./welcome.css";

export default function Welcome() {
  return (
    <div
      className="position-relative"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: window.innerWidth <= 768 ? "center" : "space-between",
          alignItems: "center",
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          direction: "rtl",
          backgroundColor: "#0B3D2E",
          color: "white",
          padding: "15px 20px",
          textAlign: "center",
        }}
      >
        <img
          src={require("../../assets/images/whiteLogo.png")}
          alt="ithra"
          style={{
            width: "80px",
            filter: "brightness(0) invert(1)",
            marginBottom: "10px",
          }}
        />
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: window.innerWidth <= 768 ? "10px 0" : "0 20px",
          }}
        >
          نبني الإنسان المنتج
        </div>
        <h1 style={{ margin: 0, fontSize: "24px" }}>
          شركة إثراء للتعليم <br /> Ithra Education Company
        </h1>
      </div>

      {/* Landing */}
      <div className="container mt-4 text-center">
        <div className="row d-flex flex-column flex-md-row justify-content-center align-items-center">
          {/* Text Section */}
          <div
            className="col-12 col-md-6 p-3"
            style={{
              background: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              direction: "rtl",
              color: "var(--green-color)",
              lineHeight: 2,
            }}
          >
            شركة رائدة في مجال التعليم في المنطقة الشرقية بالمملكة العربية
            السعودية لها من التاريخ التربوي والتعليمي عبر مدارس البنين والبنات
            ما يشهد بالعراقة والتميز في خدمة العملية التعليمية، وتقديم الناتج
            التعليمي المزود بالمعرفة والقيم، وفق أحدث الطرق والأساليب
            التعليمية والتربوية. ماض من العراقة، وحاضر يشهد بالإنجازات,
            واستشراف لمستقبل واعد.
          </div>

          {/* Video Section */}
          <div style={{ width: "48%", textAlign: "left" }}>
            <video autoPlay muted loop style={{ width: "100%" }}>
              <source src="/assets/images/ithra_video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content" style={{ marginTop: 0, flex: 1 }}>
        {" "}
        {/* No margin-top for no spaces */}
        <a href="/create" className="fs-5">
          {" "}
          تسجيل عقد طالب{" "}
        </a>
        <hr style={{ margin: "16px 0" }} />
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
