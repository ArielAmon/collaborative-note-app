import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../services/contexts/AuthContext";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

function NoteList() {
  const [notes, setNotes] = useState({});
  const [categories, setCategories] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let notesUnsubscribe = () => {};
    let categoriesUnsubscribe = () => {};

    if (currentUser) {
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", currentUser.uid)
      );
      notesUnsubscribe = onSnapshot(notesQuery, (querySnapshot) => {
        const notesData = {};
        querySnapshot.forEach((doc) => {
          const note = { id: doc.id, ...doc.data() };
          const category = note.category || "Uncategorized";
          if (!notesData[category]) {
            notesData[category] = [];
          }
          notesData[category].push(note);
        });
        setNotes(notesData);
      });

      const categoriesQuery = query(
        collection(db, "categories"),
        where("userId", "==", currentUser.uid)
      );
      categoriesUnsubscribe = onSnapshot(categoriesQuery, (querySnapshot) => {
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      });
    }

    return () => {
      notesUnsubscribe();
      categoriesUnsubscribe();
    };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">Please log in to view your notes.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Your Notes
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            component={Link}
            to="/note/new"
            variant="contained"
            color="primary"
          >
            Create New Note
          </Button>
        </Grid>
        <Grid item xs={12}>
          {categories.map((category) => (
            <Accordion key={category.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{category.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {(notes[category.id] || []).map((note) => (
                    <ListItem
                      key={note.id}
                      button
                      component={Link}
                      to={`/note/${note.id}`}
                    >
                      <ListItemText
                        primary={note.title}
                        secondary={note.content.substring(0, 50) + "..."}
                        primaryTypographyProps={{ variant: "h6" }}
                        secondaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
          {notes["Uncategorized"] && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Uncategorized</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {notes["Uncategorized"].map((note) => (
                    <ListItem
                      key={note.id}
                      button
                      component={Link}
                      to={`/note/${note.id}`}
                    >
                      <ListItemText
                        primary={note.title}
                        secondary={note.content.substring(0, 50) + "..."}
                        primaryTypographyProps={{ variant: "h6" }}
                        secondaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default NoteList;
