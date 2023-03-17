import { VotingProvider } from "./contexts/VotingContext";
import Home from "./components/Home";

function App() {
  return (
    <VotingProvider>
      <div className="min-h-screen bg-gray-100">
        <Home />
      </div>
    </VotingProvider>
  );
}

export default App;
