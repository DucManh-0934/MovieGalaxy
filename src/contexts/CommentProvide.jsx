import React, { createContext, useEffect, useState } from "react";
import {
  fetchDocumentsRealtime,
  addDocument,
  updateDocument,
} from "../services/firebaseService";

export const ContextComment = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("comments", (data) => {
      setComments(data);
    });
    return () => unsubscribe();
  }, []);

  const addComment = async (movieId, content, spoiler, account) => {
    if (!account) return;
    await addDocument("comments", {
      movieId,
      content,
      accountID: account.id,
      createdAt: new Date().toISOString(),
    });
  };

  const toggleLike = async (comment, account) => {
    if (!account) return;
    const isLiked = comment.likedBy?.includes(account.email);
    await updateDocument("comments", {
      id: comment.id,
      likedBy: isLiked
        ? comment.likedBy.filter((email) => email !== account.email)
        : [...(comment.likedBy || []), account.email],
      likes: isLiked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
    });
  };

  return (
    <ContextComment.Provider value={{ comments, addComment, toggleLike }}>
      {children}
    </ContextComment.Provider>
  );
};
