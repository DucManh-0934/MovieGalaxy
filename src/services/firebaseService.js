import { 
  addDoc, 
  collection, 
  deleteDoc, 
  doc, 
  getDoc, 
  onSnapshot, 
  updateDoc,
  query, 
  where,  
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { uploadImageToCloudinary } from "../config/cloundinaryConfig";

// ==================== COLLECTION THƯỜNG ====================

/**
 * Thêm một document mới vào collection
 * @param {string} collectionName - Tên collection (vd: "account", "movies")
 * @param {object} values - Dữ liệu cần thêm (vd: { name: "Duc Manh", email: "..." })
 * @returns {object} - Document vừa thêm kèm id
 *
 * Ví dụ dùng:
 * const newUser = await addDocument("account", { name: "Duc Manh", email: "..." });
 */
export const addDocument = async (collectionName, values) => {
  try {
    // Nếu có ảnh thì upload lên Cloudinary trước, lấy url về lưu vào Firestore
    if (values.imgUrl) {
      const imgUrl = await uploadImageToCloudinary(values.imgUrl, collectionName);
      values.imgUrl = imgUrl;
    }

    // Thêm document vào collection, Firestore tự tạo id
    const docRef = await addDoc(collection(db, collectionName), values);

    // Lấy lại document vừa thêm để trả về kèm id
    const addedDoc = await getDoc(doc(db, collectionName, docRef.id));

    return { id: docRef.id, ...addedDoc.data() };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

/**
 * Lắng nghe dữ liệu thay đổi realtime của một collection
 * @param {string} collectionName - Tên collection
 * @param {function} callback - Hàm nhận dữ liệu mới nhất mỗi khi có thay đổi
 * @returns {function} - Hàm unsubscribe để dừng lắng nghe
 *
 * Ví dụ dùng:
 * const unsubscribe = fetchDocumentsRealtime("movies", (data) => setMovies(data));
 * return () => unsubscribe();
 */
export const fetchDocumentsRealtime = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);

  // onSnapshot lắng nghe mọi thay đổi trong collection
  // mỗi khi có thêm/sửa/xóa document thì callback được gọi lại
  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  });

  return unsubscribe;
};

/**
 * Lắng nghe realtime collection theo điều kiện lọc (where)
 * @param {string} collectionName - Tên collection (vd: "playlists")
 * @param {string} field - Tên field cần lọc (vd: "uid")
 * @param {string} value - Giá trị cần lọc (vd: uid của user)
 * @param {function} callback - Hàm nhận dữ liệu mới nhất mỗi khi có thay đổi
 * @returns {function} - Hàm unsubscribe để dừng lắng nghe
 *
 * Ví dụ dùng:
 * const unsubscribe = fetchDocumentsByField("playlists", "uid", uid, (data) => setPlaylists(data));
 * return () => unsubscribe();
 */
export const fetchDocumentsByField = (collectionName, field, value, callback) => {
  // query lọc các document có field == value
  // vd: lấy tất cả playlists có uid == uid của user đang đăng nhập
  const q = query(
    collection(db, collectionName),
    where(field, "==", value)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(documents);
  });

  return unsubscribe;
};

/**
 * Cập nhật một document trong collection
 * @param {string} collectionName - Tên collection
 * @param {object} values - Dữ liệu cần cập nhật, BẮT BUỘC có trường id
 *
 * Ví dụ dùng:
 * await updateDocument("account", { id: "abc123", name: "Ten Moi" });
 */
export const updateDocument = async (collectionName, values) => {
  const { id, ...updatedValues } = values;

  const docRef = doc(collection(db, collectionName), id);

  await updateDoc(docRef, updatedValues);

  const updatedDoc = await getDoc(docRef);

  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  };
};

/**
 * Xóa một document khỏi collection
 * @param {string} collectionName - Tên collection
 * @param {object} values - Object chứa id của document cần xóa
 *
 * Ví dụ dùng:
 * await deleteDocument("account", { id: "abc123" });
 */
export const deleteDocument = async (collectionName, values) => {
  await deleteDoc(doc(collection(db, collectionName), values.id));
};
