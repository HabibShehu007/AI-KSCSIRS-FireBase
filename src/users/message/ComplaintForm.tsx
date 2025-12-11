import { useState, useEffect } from "react";
import { departmentOffenses } from "./data";
import Modal from "./Modal";
import MediaUpload from "../message/MediaUpload"; // ✅ handles UI
import { uploadFiles, uploadVoice } from "./uploadMedia"; // ✅ Firebase helpers
import { auth, db } from "../../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import {
  FiSend,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import useRecorder from "./useRecorder"; // ✅ recording logic

type Props = {
  department: string;
};

export default function ComplaintForm({ department }: Props) {
  const offenses = departmentOffenses[department] || [];

  const [user, setUser] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // ✅ useRecorder hook
  const {
    recording,
    recordTime,
    audioBlob,
    audioURL,
    startRecording,
    stopRecording, // used in MediaUpload
    resetRecording, // used after submission
  } = useRecorder();

  // ✅ Fetch user info from Firestore
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId =
          sessionStorage.getItem("userId") || auth.currentUser?.uid;
        if (!userId) {
          setUserLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser(data.name || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setAddress(data.address || "");
        }
      } catch (err) {
        console.error("❌ Error loading user info:", err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() && !audioBlob) {
      alert("Please provide a description or record/upload a voice note.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Save complaint doc first
      const docRef = await addDoc(collection(db, "complaints"), {
        subject: title,
        message: description,
        address,
        department,
        userName: user,
        userPhone: phone,
        userEmail: email,
        createdAt: new Date().toISOString(),
        status: "pending",
        files: [],
        voiceNote: null,
      });

      // ✅ Upload files (Base64 stored directly in Firestore)
      if (files) {
        await uploadFiles(files, docRef.id);
      }

      // ✅ Upload voice note (Base64 stored directly in Firestore)
      if (audioBlob) {
        await uploadVoice(audioBlob, docRef.id);
      }

      // ✅ Reset form + recorder
      setShowModal(true);
      setTitle("");
      setDescription("");
      setAddress("");
      setFiles(null);
      resetRecording();
    } catch (err) {
      console.error("❌ Failed to submit complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading user information...
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-5 rounded-xl shadow-lg border border-blue-100 max-w-md w-full mx-auto"
      >
        {/* User Info */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiUser /> Full Name
          </label>
          <input
            type="text"
            value={user}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 rounded-md text-sm"
          />

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiPhone /> Phone Number
          </label>
          <input
            type="text"
            value={phone}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 rounded-md text-sm"
          />

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiMail /> Email Address
          </label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 rounded-md text-sm"
          />
        </div>

        {/* Offense */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiAlertCircle /> Offense Type
          </label>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
            required
          >
            <option value="">Select Offense</option>
            {offenses.map((offense, idx) => (
              <option key={idx} value={offense}>
                {offense}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            rows={3}
            className="w-full px-3 py-2 border rounded-md text-sm resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiMapPin /> Location of Incident
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or landmark"
            className="w-full px-3 py-2 border rounded-md text-sm"
            required
          />
        </div>

        {/* Media Upload (files + voice note) */}
        <MediaUpload
          files={files}
          audioURL={audioURL}
          recording={recording}
          recordTime={recordTime}
          onStartRecording={startRecording}
          onStopRecording={stopRecording} // ✅ used for stop button
          onFileChange={setFiles}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-sm shadow-md ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800 text-white"
          }`}
        >
          {loading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <FiSend className="text-lg" /> Submit Complaint
            </>
          )}
        </button>
      </form>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Complaint Submitted"
        message="Your report has been successfully recorded. Thank you for speaking up!"
        type="success"
      />
      <Modal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="Submission Failed"
        message="Something went wrong. Please try again."
        type="error"
      />
    </>
  );
}
