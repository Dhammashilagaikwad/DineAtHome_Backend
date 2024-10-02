const { Router } = require("express");
const { authenticateUser } = require('../services/authentication');
const { getAllUsers, getUserById, postloginUser, posthandleUserSignup, editUserById, deleteUserById, logoutUser, deleteUserAccount} = require("../controllers/userController")
const router = Router();




//login or signup routes 
router.get('/getAllUsers', getAllUsers);
router.get('/getUser/:id', getUserById);

router.post("/login", postloginUser);
router.post('/signup', posthandleUserSignup);
router.post("/logout", logoutUser);

router.put('/editUser/:userId', editUserById);
router.delete('/deleteUser/:id', deleteUserById);
router.post('/delete-UserAccount',authenticateUser, deleteUserAccount);






// //login route
// router.get('/signup', gethandleUserSignup);
// router.post('/signup', posthandleUserSignup);



// //login route
// router.get("/login", getloginUser);
// router.post("/login", postloginUser);

// //edit-profile
// router.put("/edit-profile", authenticateUser, editProfile)

// //logout route
// router.get("/logout", logoutUser);



module.exports = router;