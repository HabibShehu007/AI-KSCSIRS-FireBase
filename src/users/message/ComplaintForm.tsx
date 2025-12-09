import { useState, useRef, useEffect } from "react";
import { departmentOffenses } from "./data";
import Modal from "./Modal";
import {
  FiSend,
  FiPaperclip,
  FiMic,
  FiMicOff,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";

// Firebase imports
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const startRecording = async () => {
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      alert(
        "Recording not supported on your device. Please upload a voice file instead."
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };
      mediaRecorder.start();
    } catch {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() && !audioURL) {
      alert("Please provide a description or record/upload a voice note.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Upload files to Firebase Storage
      const fileURLs: string[] = [];
      if (files) {
        for (const file of Array.from(files)) {
          const storageRef = ref(storage, `complaints/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          fileURLs.push(url);
        }
      }

      // ✅ Save complaint to Firestore
      await addDoc(collection(db, "complaints"), {
        subject: title,
        message: description,
        address,
        department,
        files: fileURLs,
        voiceNote: audioURL ?? null,
        userName: user,
        userPhone: phone,
        userEmail: email,
        createdAt: new Date().toISOString(),
        status: "pending", // 👈 admins can filter by status
      });

      setShowModal(true);
      setTitle("");
      setDescription("");
      setAddress("");
      setFiles(null);
      setAudioURL(null);
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
            <FiPaperclip /> Description
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

        {/* Attachments */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiPaperclip /> Attachments
          </label>
          <p className="text-xs text-gray-500">
            Add photos or documents to support your complaint.
          </p>

          <input
            id="file-upload"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            <FiPaperclip className="text-lg" /> Add Attachment
          </button>

          {files && files.length > 0 && (
            <ul className="mt-2 text-xs text-gray-700 font-medium space-y-1">
              {Array.from(files).map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md shadow-sm"
                >
                  <FiPaperclip className="text-gray-500" /> {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Voice Note */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FiMic /> Voice Note
          </label>
          <p className="text-xs text-gray-500">
            Record a short voice message (if supported) or upload an audio file.
          </p>

          {!audioURL ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                <FiMic /> Start
              </button>
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                <FiMicOff /> Stop
              </button>
            </div>
          ) : (
            <audio controls src={audioURL} className="w-full rounded" />
          )}

          {/* Fallback for unsupported browsers */}
          {!("MediaRecorder" in window) && (
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFiles(e.target.files)}
              className="text-sm text-gray-600"
            />
          )}
        </div>

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
      />
    </>
  );
}
