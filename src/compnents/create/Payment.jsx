export default function Payment({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleTransportationChange = (e) => {
    const { name, value } = e.target;
    if (name === "required") {
      if (value === "false") {
        setData({
          ...data,
          transportation: {
            required: false,
            neighborhood: "",
            path: "",
          },
        });
      } else {
        // When transportation is required, set default path to "One path"
        setData({
          ...data,
          transportation: {
            ...data.transportation,
            required: true,
            path: data.transportation.path || "One path", // Set default path if empty
          },
        });
      }
    } else {
      setData({
        ...data,
        transportation: { ...data.transportation, [name]: value },
      });
    }
  };

  // Convert boolean to string for select value
  const getBooleanString = (value) => {
    if (value === true || value === "true") return "true";
    if (value === false || value === "false") return "false";
    return "false";
  };

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">آلية سداد الرسوم الدراسية</h5>
      <hr className="w-50" />

      {/* Payment Type Selection */}
      <div className="my-3">
        <div className="form-group w-100 mt-3">
          {/* <label>نوع السداد</label> */}
          <select
            name="paymentType"
            className="form-control"
            value={data.paymentType}
            onChange={handleChange}
            required
          >
            <option value="">اختر نوع السداد</option>
            <option value="Annual">سداد سنوي</option>
            <option value="Quarterly">سداد فصلي</option>
          </select>
        </div>
        <h5 className="fw-bold mt-3">النقل المدرسي</h5>
        {/* Transportation Selection */}
        <div className="form-group w-45 mt-3">
          <label>هل ترغب بتسجيل الطالب ضمن النقل المدرسى للمدارس</label>
          <select
            name="required"
            className="form-control"
            value={getBooleanString(data.transportation.required)}
            onChange={handleTransportationChange}
            required
          >
            <option value="false">لا</option>
            <option value="true">نعم</option>
          </select>
        </div>
      </div>

      {/* Show these inputs only if transportation is required */}
      {(data.transportation.required === true || data.transportation.required === "true") && (
        <div className="d-flex justify-content-between my-3">
          <div className="form-group w-45 mt-3">
            <label>الحى</label>
            <input
              type="text"
              name="neighborhood"
              className="form-control"
              value={data.transportation.neighborhood}
              onChange={handleTransportationChange}
              required
            />
          </div>

          <div className="form-group w-45 mt-3">
            <label>المسار</label>
            <select
              name="path"
              className="form-control"
              value={data.transportation.path || "One path"}
              onChange={handleTransportationChange}
              required
            >
              <option value="One path">مسار واحد</option>
              <option value="Two paths">مسارين</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
