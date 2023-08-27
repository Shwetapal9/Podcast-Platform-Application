import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { setUser } from "./utils/slices/userSlice";
import { db, auth } from "./firebase";
import { useDispatch } from "react-redux";
import CreatePodcast from "./pages/CreatePodcast";
import PrivateRoutes from "./components/PrivateRoutes";
import Podcasts from "./pages/Podcasts";
import PodcastDetails from "./pages/PodcastDetails";
import CreateEpisode from "./pages/CreateEpisode";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                  ProfilePic: userData.ProfilePic,
                })
              );
            }
          },
          (error) => {
            console.error("Error in fething user data:", error);
          }
        );
        return () => {
          unsubscribeSnapshot();
        };
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/start-a-podcast" element={<CreatePodcast />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/podcast/:id" element={<PodcastDetails />} />
            <Route
              path="/podcast/:id/create-episode"
              element={<CreateEpisode />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};
export default App;
