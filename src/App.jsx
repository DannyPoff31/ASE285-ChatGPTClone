import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Dashboard from "./Dashboard/Dashboard";
import { initializeAI } from "./services/openaiService";
import { loadConversations } from "./Dashboard/dashboardSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize OpenAI client and then load conversations
    (async () => {
      await initializeAI();
      // Load conversations from localStorage after OpenAI initialized
      dispatch(loadConversations());
    })();
  }, [dispatch]);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
