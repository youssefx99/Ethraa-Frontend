import { useEffect, useState } from "react";

export default function Student({ data, setData }) {
  // Handle changes for main student fields

  const [showPreviousSchool, setShowPreviousSchool] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "previouslyEnrolled" ? value === "true" : value;

    setData({ ...data, [name]: newValue });

    if (name === "previouslyEnrolled") {
      setShowPreviousSchool(newValue); // Trigger visibility
    }
  };

  // Handle updates from API (Edit Mode)
  useEffect(() => {
    if (data.previouslyEnrolled) {
      setShowPreviousSchool(true);
    }
  }, [data.previouslyEnrolled]);

  useEffect(() => {
    // If boys school is selected and current stage is Kindergarten, reset the stage
    if (
      data.requiredSchool === "boys" &&
      data.requiredStage === "Kindergarten"
    ) {
      setData({
        ...data,
        requiredStage: "",
        requiredGrade: "",
      });
    }
  }, [data.requiredSchool]);

  // Handle changes for siblings
  const handleSiblingChange = (index, e) => {
    const { name, value } = e.target;
    const newSiblings = [...data.siblings];
    newSiblings[index] = { ...newSiblings[index], [name]: value };
    setData({ ...data, siblings: newSiblings });
  };

  // Add a new sibling to the siblings array
  const addSibling = () => {
    setData({
      ...data,
      siblings: [
        ...data.siblings,
        { name: "", school: "", stage: "", grade: "" },
      ],
    });
  };

  // Remove a sibling from the siblings array
  const removeSibling = (index) => {
    const newSiblings = data.siblings.filter((_, i) => i !== index);
    setData({ ...data, siblings: newSiblings });
  };

  // Generate grade options based on selected stage
  const generateGradeOptions = (type, broInfo = null) => {
    let check = null;
    if (type === "student") check = data.requiredStage;
    else if (type === "bro") check = broInfo.stage;
    if (check === "Kindergarten") {
      return ["المستوى الأول", "المستوى الثاني", "المستوى الثالث"];
    } else if (check === "Elementary") {
      return [
        "الصف الأول",
        "الصف الثاني",
        "الصف الثالث",
        "الصف الرابع",
        "الصف الخامس",
        "الصف السادس",
      ];
    } else if (check === "Middle" || check === "High") {
      return ["الصف الأول", "الصف الثاني", "الصف الثالث"];
    }
    return [];
  };

  // Convert boolean to string for select value
  const getBooleanString = (value) => {
    if (value === true || value === "true") return "true";
    if (value === false || value === "false") return "false";
    return " ";
  };

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">البند الثالث :بيانات الطالب</h5>
      <hr className="w-50" />

      <div className="d-flex justify-content-between">
        {/* Student Name */}
        <div className="form-group w-45 mt-3">
          <label>اسم الطالب رباعى</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nationality */}
        <div className="form-group w-45 mt-3">
          <label>الجنسية</label>
          <input
            type="text"
            name="nationality"
            className="form-control"
            value={data.nationality}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Birth Place */}
      <div className="form-group w-45 mt-3">
        <label>مكان الميلاد</label>
        <input
          type="text"
          name="birthPlace"
          className="form-control"
          value={data.birthPlace}
          onChange={handleChange}
          required
        />
      </div>

      <div className="d-flex justify-content-between">
        {/* Birth Date */}
        <div className="form-group w-45 mt-3">
          <label>تاريخ الميلاد ميلادي</label>
          <input
            type="date"
            name="birthDate"
            className="form-control"
            value={data.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* ID Number */}
        <div className="form-group w-45 mt-3">
          <label>رقم الهوية/الإقامة</label>
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

      <div className="d-flex justify-content-between">
        {/* ID Issue Date */}
        <div className="form-group w-45 mt-3">
          <label>تاريخ الاصدار الميلادي</label>
          <input
            type="date"
            name="idIssueDate"
            className="form-control"
            value={data.idIssueDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* ID Issue Place */}
        <div className="form-group w-45 mt-3">
          <label>مكان الإصدار</label>
          <input
            type="text"
            name="idIssuePlace"
            className="form-control"
            value={data.idIssuePlace}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Previously Enrolled */}
      <div className="form-group w-75 mt-3">
        <label>هل كان الطالب يدرس في مدرسة أخرى؟</label>
        <select
          name="previouslyEnrolled"
          className="form-control"
          value={data.previouslyEnrolled}
          onChange={handleChange}
          required
        >
          <option value=" "></option>
          <option value="false">لا</option>
          <option value="true">نعم</option>
        </select>
      </div>

      {/* Conditionally Show Previous School Inputs */}
      {showPreviousSchool && (
        <div className="d-flex justify-content-between mt-3">
          <div className="form-group w-25">
            <label>اسم المدرسة</label>
            <input
              type="text"
              name="previousSchoolName"
              className="form-control"
              value={data.previousSchoolName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group w-25 mt-3">
            <label>المدينة</label>
            <input
              type="text"
              name="previousSchoolCity"
              className="form-control"
              value={data.previousSchoolCity || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group w-25 mt-3">
            <label>النوع</label>
            <select
              name="previousSchoolType"
              className="form-control"
              value={data.previousSchoolType || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled className="d-none"></option>
              <option value="حكومي">حكومي</option>
              <option value="أهلي">أهلي</option>
              <option value="عالمي">عالمي</option>
            </select>
          </div>
        </div>
      )}

      {/* Required School */}
      <div className="form-group w-50 mt-3">
        <label>المدرسة المطلوب الالتحاق بها</label>
        <select
          name="requiredSchool"
          className="form-control"
          value={data.requiredSchool}
          onChange={handleChange}
          required
        >
          <option value="" disabled className="d-none"></option>
          <option value="girls">مدارس الأوائل الأهلية بنات</option>
          <option value="boys">مدارس الأوائل الأهلية بنين</option>
        </select>
      </div>

      <div className="d-flex justify-content-between">
        {/* Required Stage */}
        <div className="form-group w-45 mt-3">
          <label>المرحلة</label>
          <select
            name="requiredStage"
            className="form-control"
            value={data.requiredStage}
            onChange={handleChange}
            required
          >
            <option value="" disabled className="d-none"></option>
            {data.requiredSchool !== "boys" && (
              <option value="Kindergarten">رياض الأطفال</option>
            )}
            <option value="Elementary">المرحلة الابتدائية</option>
            <option value="Middle">المتوسطة</option>
            <option value="High">الثانوية</option>
          </select>
        </div>

        {/* Required Grade */}
        <div className="form-group w-45 mt-3">
          <label>الصف المطلوب الالتحاق به</label>
          <select
            name="requiredGrade"
            className="form-control"
            value={data.requiredGrade}
            onChange={handleChange}
            required
          >
            <option value="" disabled className="d-none"></option>
            {generateGradeOptions("student").map((grade, index) => (
              <option key={index} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Has Siblings in Ithraa */}
      <div className="form-group mt-3">
        <label>هل للطالب أخ أو أخت في مدارس إثراء؟</label>
        <select
          name="hasSiblingsInIthraa"
          className="form-control"
          value={getBooleanString(data.hasSiblingsInIthraa)}
          onChange={handleChange}
        >
          <option value=" "></option>
          <option value="false">لا</option>
          <option value="true">نعم</option>
        </select>
      </div>

      {/* Conditionally Render Add Sibling Section */}
      {(data.hasSiblingsInIthraa === true || data.hasSiblingsInIthraa === "true") && (
        <>
          <button className="btn btn-primary mt-3" onClick={addSibling}>
            إضافة أخ/أخت
          </button>
          {data.siblings.map((sibling, index) => (
            <div key={index} className="d-flex justify-content-between mt-3">
              <div className="form-group w-20">
                <label>اسم الأخ أو الأخت</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={sibling.name}
                  onChange={(e) => handleSiblingChange(index, e)}
                />
              </div>

              <div className="form-group w-20">
                <label>المدرسة</label>
                <select
                  name="school"
                  className="form-control"
                  value={sibling.school}
                  onChange={(e) => handleSiblingChange(index, e)}
                >
                  <option value="" disabled className="d-none"></option>
                  <option value="girls">مدارس الأوائل الأهلية بنات</option>
                  <option value="boys">مدارس الأوائل الأهلية بنين</option>
                </select>
              </div>

              <div className="form-group w-20">
                <label>المرحلة</label>
                <select
                  name="stage"
                  className="form-control"
                  value={sibling.stage}
                  onChange={(e) => handleSiblingChange(index, e)}
                >
                  <option value="" disabled className="d-none"></option>
                  <option value="Kindergarten">رياض الأطفال</option>
                  <option value="Elementary">المرحلة الابتدائية</option>
                  <option value="Middle">المتوسطة</option>
                  <option value="High">الثانوية</option>
                </select>
              </div>

              <div className="form-group w-20">
                <label>الصف</label>
                <select
                  name="grade"
                  className="form-control"
                  value={sibling.grade}
                  onChange={(e) => handleSiblingChange(index, e)}
                >
                  <option value="" disabled className="d-none"></option>
                  {generateGradeOptions("bro", sibling).map((grade, idx) => (
                    <option key={idx} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete Button for Sibling */}
              <button
                className="btn btn-danger mt-2"
                onClick={() => removeSibling(index)}
              >
                حذف الأخ/الأخت
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
