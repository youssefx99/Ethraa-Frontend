// components/CreateAdmin.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Container,
  Card,
} from "react-bootstrap";
import Header from "../../common/Header";

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [editFormData, setEditFormData] = useState({
    email: "",
    password: "",
  });

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/get-admins`,
        {
          credentials: "include",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await response.json();

      if (data.success) {
        // Check if data.admins exists and is an array
        if (Array.isArray(data.admins)) {
          setAdmins(data.admins);
        } else if (Array.isArray(data.data)) {
          // Some APIs might return data in a data property
          setAdmins(data.data);
        } else {
          console.error("Unexpected API response structure:", data);
          setError("تنسيق البيانات غير متوقع من الخادم");
          setAdmins([]);
        }
      } else {
        console.error("API returned error:", data.message);
        setError(data.message || "حدث خطأ في جلب بيانات المدراء");
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("حدث خطأ في جلب بيانات المدراء");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Create new admin
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/create-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("تم إنشاء المدير بنجاح!");
        setShowCreateModal(false);
        setFormData({ email: "", password: "" });
        fetchAdmins();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("حدث خطأ في إنشاء المدير");
    } finally {
      setLoading(false);
    }
  };

  // Edit admin
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/edit-admin/${selectedAdmin._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editFormData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("تم تحديث بيانات المدير بنجاح!");
        setShowEditModal(false);
        fetchAdmins();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("حدث خطأ في تحديث بيانات المدير");
    } finally {
      setLoading(false);
    }
  };

  // Delete admin
  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-admin/${selectedAdmin._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("تم حذف المدير بنجاح!");
        setShowDeleteModal(false);
        fetchAdmins();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("حدث خطأ في حذف المدير");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setEditFormData({
      email: admin.email,
      password: "", // Don't show current password
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  return (
    <>
      <Header />
      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Header className="text-white" style={{ backgroundColor: '#073d30' }}>
            <div className="d-flex justify-content-between align-items-center">
              <Button 
                variant="light" 
                onClick={handleBack}
                className="d-flex align-items-center"
              >
                رجوع
              </Button>
              <h3 className="mb-0 text-center flex-grow-1">إدارة المدراء</h3>
              <Button
                variant="light"
                onClick={() => setShowCreateModal(true)}
                style={{ minWidth: '120px' }} // To balance with back button
              >
                إضافة مدير جديد
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">جاري التحميل...</span>
                </Spinner>
              </div>
            ) : (
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>البريد الإلكتروني</th>
                    <th>تاريخ الإنشاء</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        لا يوجد مدراء حالياً
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin._id}>
                        <td>{admin.email}</td>
                        <td>{new Date(admin.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(admin)}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(admin)}
                          >
                            حذف
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Create Admin Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>إضافة مدير جديد</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "إنشاء"
                  )}
                </Button>
        </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Admin Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>تعديل بيانات المدير</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>كلمة المرور الجديدة (اختياري)</Form.Label>
                <Form.Control
                  type="password"
                  value={editFormData.password}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, password: e.target.value })
                  }
                  placeholder="اتركها فارغة إذا لم ترد تغيير كلمة المرور"
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  إلغاء
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      جاري التحديث...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
    </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>تأكيد الحذف</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            هل أنت متأكد من حذف المدير {selectedAdmin?.email}؟
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              إلغاء
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  جاري الحذف...
                </>
              ) : (
                "حذف"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default CreateAdmin;
