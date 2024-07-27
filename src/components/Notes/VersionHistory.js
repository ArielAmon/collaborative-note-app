import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function VersionHistory({ noteId, open, onClose }) {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    if (noteId) {
      const q = query(
        collection(db, `notes/${noteId}/versions`),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const versionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVersions(versionsData);
      });

      return unsubscribe;
    }
  }, [noteId]);

  const handleRevert = async (version) => {
    if (window.confirm("Are you sure you want to revert to this version?")) {
      await updateDoc(doc(db, "notes", noteId), {
        title: version.title,
        content: version.content,
        updatedAt: new Date(),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Version History</DialogTitle>
      <DialogContent>
        <List>
          {versions.map((version) => (
            <ListItem key={version.id}>
              <ListItemText
                primary={version.title}
                secondary={`Last modified: ${version.createdAt
                  .toDate()
                  .toLocaleString()}`}
              />
              <Button onClick={() => handleRevert(version)}>Revert</Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VersionHistory;
