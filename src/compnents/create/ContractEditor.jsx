export default function ContractEditor({ data, setData }) {
  // Handle input changes for the contract editor
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">البند الثانى :بيانات ولى الامر (محرر العقد).</h5>
      <hr className="w-50" />

      <div className="d-flex justify-content-between mt-3">
        <div className="form-group w-45">
          <label>اسم محرر العقد (الاسم ثلاثي)</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group w-45">
          <label>رقم الهوية / الإقامة</label>
          <input
            type="number"
            name="idNumber"
            className="form-control"
            value={data.idNumber}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.slice(0, 10);
            }}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div className="form-group w-45">
          <label>صلة القرابة</label>
          <input
            type="text"
            name="relationship"
            className="form-control"
            value={data.relationship}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group w-45">
          <label>رقم الجوال المسجل فى أبشر</label>
          <input
            type="text"
            name="absherMobileNumber"
            className="form-control"
            value={data.absherMobileNumber}
            onChange={handleChange}
            placeholder="05XXXXXXXX"
            onInput={(e) => {
              e.target.value = e.target.value.slice(0, 10);
            }}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div className="form-group w-45 mt-3">
          <label>رقم جوال آخر</label>
          <input
            type="text"
            name="additionalMobileNumber"
            className="form-control"
            value={data.additionalMobileNumber}
            onChange={handleChange}
            placeholder="05XXXXXXXX"
            onInput={(e) => {
              e.target.value = e.target.value.slice(0, 10);
            }}
            required
          />
        </div>

        <div className="form-group w-45 mt-3">
          <label>عنوان السكن بالتفصيل</label>
          <input
            type="text"
            name="residentialAddress"
            className="form-control"
            value={data.residentialAddress}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div className="form-group w-45">
          <label>المهنة</label>
          <input
            type="text"
            name="profession"
            className="form-control"
            value={data.profession}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group w-45">
          <label>عنوان العمل</label>
          <input
            type="text"
            name="workAddress"
            className="form-control"
            value={data.workAddress}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div className="form-group w-45">
          <label>رقم هاتف العمل</label>
          <input
            type="number"
            name="workPhoneNumber"
            className="form-control"
            value={data.workPhoneNumber}
            onChange={handleChange}
            placeholder="05XXXXXXXX - 01XXXXXXXX"
            onInput={(e) => {
              e.target.value = e.target.value.slice(0, 10);
            }}
            required
          />
        </div>

        <div className="form-group w-45">
          <label>تحويلة (اختياري)</label>
          <input
            type="text"
            name="extension"
            className="form-control"
            value={data.extension}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
