import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../services/contexts/AuthContext";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function CategoryManager({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "categories"),
        where("userId", "==", currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      });

      return unsubscribe;
    }
  }, [currentUser]);

  const handleAddCategory = async () => {
    if (newCategory.trim() !== "") {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        userId: currentUser.uid,
      });
      setNewCategory("");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, "categories", categoryId));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Categories</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          margin="normal"
        />
        <Button onClick={handleAddCategory} variant="contained" color="primary">
          Add Category
        </Button>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={category.name} />
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

export default CategoryManager;
