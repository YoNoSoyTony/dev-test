import React, { useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import {
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  CardContent,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function UserView({ user, setUser, token, setToken }) {
  const [showBalance, setShowBalance] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/profile",
        editUser,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(response.data);
      setOpenAlert(true);
      setEditUser(false)
    } catch (error) {
      console.error("Error:", error);
      setOpenAlert(true);
    }
  };

  return (
    <>
      <Dialog onClose={() => setEditUser(false)} open={Boolean(editUser)}>
        <DialogTitle id="alert-dialog-title">Edit user details</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                label="First Name"
                fullWidth
                value={editUser.name?.first}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    name: { first: e.target.value, last: editUser.name.last },
                  })
                }
              />
              <br />
              <br />
              <TextField
                label="Last Name"
                fullWidth
                value={editUser.name?.last}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    name: { last: e.target.value, first: editUser.name.first },
                  })
                }
              />
              <br />
              <br />
              <TextField
                label="Email"
                fullWidth
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <br />
              <br />
              <TextField
                label="Company"
                fullWidth
                value={editUser.company}
                onChange={(e) =>
                  setEditUser({ ...editUser, company: e.target.value })
                }
              />
              <br />
              <br />
              <TextField
                label="Phone"
                fullWidth
                value={editUser.phone}
                onChange={(e) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
              />
              <br />
              <br />
              <TextField
                label="Address"
                fullWidth
                value={editUser.address}
                onChange={(e) =>
                  setEditUser({ ...editUser, address: e.target.value })
                }
              />
              <br />
              <br />
              <TextField
                label="Age"
                fullWidth
                type="number"
                value={editUser.age}
                onChange={(e) =>
                  setEditUser({ ...editUser, age: parseInt(e.target.value) })
                }
              />
              <br />
              <br />
              <TextField
                label="Eye Color"
                fullWidth
                value={editUser.eyeColor}
                onChange={(e) =>
                  setEditUser({ ...editUser, eyeColor: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditUser(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog onClose={() => setShowBalance(false)} open={showBalance}>
        <DialogTitle id="alert-dialog-title">Balance</DialogTitle>
        <DialogContent sx={{ width: "400px" }}>
          <DialogContentText id="alert-dialog-description">
            {user.balance}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBalance(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SMART PUMP
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              setUser(false);
              setToken("");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Card sx={{ margin: "1rem", display: "flex", flexDirection: "column" }}>
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <img
              src={user.picture}
              alt={user.name.first + " " + user.name.last}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                maxWidth: "100%",
                marginBottom: "15px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "10px",
                gap: "1rem",
              }}
            >
              <Button variant="outlined" onClick={() => setShowBalance(true)}>
                Balance
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditUser({ ...user })}
              >
                Edit
              </Button>
            </Box>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6">
                {user.name.first} {user.name.last}
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
              <Typography variant="body1">{user.company}</Typography>
              <Typography variant="body1">{user.phone}</Typography>
              <Typography variant="body1">{user.address}</Typography>
              <Typography variant="body1">{user.eyeColor} eyes</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default UserView;
