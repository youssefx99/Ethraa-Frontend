export default function data({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // onUpdate({ ...formData, [name]: value });
  };

  const handleEmergencyChange = (index, e) => {
    const { name, value } = e.target;

    // Clone the contactPersons array
    const updatedContacts = [...data.contactPersons];

    // Update the correct contact object at the specified index
    updatedContacts[index] = {
      ...updatedContacts[index],
      [name]: value, // Dynamically update the specific field
    };

    // Update the state with the new contactPersons array
    setData({
      ...data,
      contactPersons: updatedContacts, // Only update the contactPersons field
    });
  };

  return (
    <>
      <div className="container mt-4">
        <h5 className="fw-bold">البند الاول :بيانات ولى الأمر (الاب).</h5>
        <hr className="w-50" />
        <div className="d-flex justify-content-between mt-3">
          <div className="form-group w-45">
            <label>اسم ولي الأمر (الاسم ثلاثي)</label>
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
              pattern="\d{10}"
              maxLength="10"
              type="number"
              required
              name="idNumber"
              className="form-control"
              value={data.idNumber}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10);
              }}
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
            <label>رقم الجوال المسجل في أبشر</label>
            <input
              type="number"
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

        <div className="form-group w-45 mt-3">
          <label>رقم جوال آخر (اختياري)</label>
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
          />
        </div>

        <div className="form-group mt-3">
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
              required
              value={data.workPhoneNumber}
              onChange={handleChange}
              placeholder="05XXXXXXXX - 01XXXXXXXX"
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10);
              }}
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

        <hr />
        <u>أشخاص يمكن الاتصال بهم عند الضرورة</u>
        <hr className="w-35" />

        {data.contactPersons.map((contact, index) => (
          <div
            key={index}
            className="emergency-contact d-flex justify-content-between mt-3"
          >
            <div className="form-group w-25">
              <label>{index === 0 ? "الاسم" : "الاسم"}</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={contact.name}
                onChange={(e) => handleEmergencyChange(index, e)} // Update specific contact
                required={index === 0}
              />
            </div>

            <div className="form-group w-25">
              <label>{index === 0 ? "صلة القرابة" : "صلة القرابة"}</label>
              <input
                type="text"
                name="relationship"
                className="form-control"
                value={contact.relationship}
                onChange={(e) => handleEmergencyChange(index, e)} // Update specific contact
                required={index === 0}
              />
            </div>

            <div className="form-group w-25">
              <label>{index === 0 ? "رقم الجوال" : "رقم الجوال"}</label>
              <input
                type="number"
                name="mobileNumber"
                className="form-control"
                value={contact.mobileNumber}
                onChange={(e) => handleEmergencyChange(index, e)} // Update specific contact
                onInput={(e) => {
                  e.target.value = e.target.value.slice(0, 10);
                }}
                required={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
