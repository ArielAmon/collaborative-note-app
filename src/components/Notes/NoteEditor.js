import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../../services/contexts/AuthContext";
import VersionHistory from "./VersionHistory";

function NoteEditor() {
  const [note, setNote] = useState({ title: "", content: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [openVersionHistory, setOpenVersionHistory] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "categories"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      }
    };

    fetchCategories();
  }, [currentUser]);

  useEffect(() => {
    if (id === "new") {
      setNote({ title: "", content: "", category: "" });
    } else {
      const unsubscribe = onSnapshot(doc(db, "notes", id), (doc) => {
        if (doc.exists()) {
          setNote({ id: doc.id, ...doc.data() });
        } else {
          navigate("/");
        }
      });

      return unsubscribe;
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleSave = async () => {
    if (id === "new") {
      const newNoteRef = doc(collection(db, "notes"));
      await setDoc(newNoteRef, {
        ...note,
        userId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      navigate("/");
    } else {
      await addDoc(collection(db, `notes/${id}/versions`), {
        ...note,
        createdAt: new Date(),
      });

      await updateDoc(doc(db, "notes", id), {
        ...note,
        updatedAt: new Date(),
      });
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "notes", id));
      navigate("/");
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== "") {
      const newCategoryRef = await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        userId: currentUser.uid,
      });
      setCategories([
        ...categories,
        { id: newCategoryRef.id, name: newCategory.trim() },
      ]);
      setNewCategory("");
      setOpenAddCategory(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {id === "new" ? "Create Note" : "Edit Note"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            value={note.title}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={note.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={() => setOpenAddCategory(true)} sx={{ mt: 1 }}>
            Add New Category
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={10}
            name="content"
            label="Content"
            value={note.content}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Save
          </Button>
          {id !== "new" && (
            <>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="secondary"
                sx={{ mr: 2 }}
              >
                Delete
              </Button>
              <Button
                onClick={() => setOpenVersionHistory(true)}
                variant="outlined"
              >
                Version History
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      {id !== "new" && (
        <VersionHistory
          noteId={id}
          open={openVersionHistory}
          onClose={() => setOpenVersionHistory(false)}
        />
      )}
      <Dialog open={openAddCategory} onClose={() => setOpenAddCategory(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCategory(false)}>Cancel</Button>
          <Button onClick={handleAddCategory}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default NoteEditor;
