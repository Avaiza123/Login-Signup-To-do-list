import { useState, useEffect } from "react";
import { Button, message, Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [editingText, setEditingText] = useState(null);
  const [visible, setVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleAddText = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "texts"), { text: newText });
      message.success("Text added successfully!");
      setTexts([...texts, { id: docRef.id, text: newText }]);
      setNewText("");
      setVisible(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTexts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "texts"));
      const textsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTexts(textsData);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const handleDeleteText = async (id) => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "texts", id));
      setTexts(texts.filter((text) => text.id !== id));
      message.success("Text deleted successfully!");
    } catch (error) {
      message.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleModifyText = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "texts", editingText.id);
      await updateDoc(docRef, { text: modalText });
      setTexts(
        texts.map((text) =>
          text.id === editingText.id ? { ...text, text: modalText } : text
        )
      );
      message.success("Text modified successfully!");
      setEditingText(null);
      setModalText("");
      setVisible(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h3>Welcome to the Dashboard</h3>
        <Button
          type="primary"
          onClick={handleLogout}
          style={{ float: "right" }}
        >
          Log Out
        </Button>
      </div>
      <div className="container">
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          className="dashboard-button"
          disabled={loading}
        >
          Add Text
        </Button>
        <ul>
          {texts.map((text) => (
            <li key={text.id}>
              {text.text}
              <div>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingText(text);
                    setModalText(text.text);
                    setVisible(true);
                  }}
                  disabled={loading || deleting}
                >
                  Modify
                </Button>
                <Button
                  type="link"
                  onClick={() => handleDeleteText(text.id)}
                  loading={deleting}
                  disabled={loading || deleting}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Modal
          title={editingText ? "Modify Text" : "Add Text"}
          visible={visible}
          onOk={editingText ? handleModifyText : handleAddText}
          confirmLoading={loading}
          onCancel={() => {
            setVisible(false);
            setEditingText(null);
            setModalText("");
          }}
        >
          <Input
            value={editingText ? modalText : newText}
            onChange={(e) => {
              if (editingText) {
                setModalText(e.target.value);
              } else {
                setNewText(e.target.value);
              }
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
