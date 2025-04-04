import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const tableData = [
  ["Item A1", "Item A2", "Item A3"],
  ["Item B1", "Item B2", "Item B3"],
  ["Item C1", "Item C2", "Item C3"],
];

const SwipeableDialogs = () => {
  const [openDialogs, setOpenDialogs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [zIndexes, setZIndexes] = useState({});

  const openDialog = (content) => {
    setOpenDialogs((prev) => {
      const newDialog = { id: prev.length, content };
      return [...prev, newDialog];
    });
    setActiveIndex((prev) => prev + 1);
    setZIndexes((prev) => ({
      ...prev,
      [openDialogs.length]: Object.keys(prev).length + 1, // Set the highest z-index
    }));
  };

  const closeDialog = (id) => {
    setOpenDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const updateZIndexes = (newActiveIndex) => {
    setZIndexes(() => {
      let updatedZIndexes = {};
      openDialogs.forEach((_, index) => {
        if (index === newActiveIndex) {
          updatedZIndexes[index] = 100; // Active dialog should be on top
        } else {
          updatedZIndexes[index] = 90 - Math.abs(newActiveIndex - index) * 10; // Decrease z-index gradually
        }
      });
      return updatedZIndexes;
    });
  };

  const handleSwipe = (direction) => {
    setActiveIndex((prev) => {
      let newIndex = prev;

      if (direction === "left") {
        newIndex = Math.min(prev + 1, openDialogs.length - 1);
      } else if (direction === "right") {
        newIndex = Math.max(prev - 1, 0);
      }

      updateZIndexes(newIndex); // Ensure the new active dialog gets the top z-index

      return newIndex;
    });
  };

  console.log("dm current activeIndex =>", activeIndex);
  console.log("dm openDialogs =>", openDialogs);
  return (
    <div style={{ padding: "20px" }}>
      {/* Table Component */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Column 1</TableCell>
              <TableCell>Column 2</TableCell>
              <TableCell>Column 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={colIndex}
                    onClick={() => openDialog(cell)}
                    style={{ cursor: "pointer", background: "#f5f5f5" }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stackable Swipeable Dialogs */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {openDialogs.map((dialog, index) => {
            console.log("dm dialog =>", dialog);
            const isActive = index === activeIndex;
            return (
              <Dialog
                key={dialog.id}
                open={true}
                maxWidth="sm"
                fullWidth
                hideBackdrop
                disableEscapeKeyDown
                disableEnforceFocus
                autoFocus
                sx={{ zIndex: zIndexes[index] || 1 }}
                PaperProps={{
                  component: motion.div,
                  initial: { opacity: 0, scale: 0.9 },
                  animate: {
                    x: (index - activeIndex) * 150,
                    scale: index === activeIndex ? 1 : 0.85,
                    opacity: 1,
                  },
                  exit: { opacity: 0, scale: 0.8 },
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                  drag: "x",
                  dragConstraints: { left: 0, right: 0 },
                  dragElastic: 0.2,
                  onDragEnd: (_, info) => {
                    if (info.offset.x < -100) {
                      handleSwipe("left");
                    } else if (info.offset.x > 100) {
                      handleSwipe("right");
                    }
                  },
                  style: {
                    position: "absolute",
                    minWidth: "400px",
                    borderRadius: "15px",
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                    cursor: "grab",
                    zIndex: zIndexes[index] || 1,
                  },
                }}
              >
                <DialogTitle>{dialog.content}</DialogTitle>
                <DialogContent>
                  <p>Details about {dialog.content}</p>
                  <Button
                    variant="contained"
                    onClick={() =>
                      openDialog(`New Dialog from ${dialog.content}`)
                    }
                  >
                    Open Another Dialog
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => closeDialog(dialog.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Close
                  </Button>
                </DialogContent>
              </Dialog>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeableDialogs;
