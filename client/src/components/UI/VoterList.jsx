import { useState, useEffect } from "react";
import useVoting from "../../contexts/VotingContext/useVoting";

const VoterList = () => {
  const {
    state: { contract, accounts, web3, txhash, voterList },
    dispatch,
  } = useVoting();

  const [inputAddress, setInputAddress] = useState("");

  useEffect(() => {
    (async function () {
      if (contract) {
        const deployTx = await web3.eth.getTransaction(txhash);
        const results = await contract.getPastEvents("VoterRegistered", {
          fromBlock: deployTx.blockNumber,
          toBlock: "latest",
        });
        const oldAddresses = results.map((oldEvent) => {
          let PastE = oldEvent.returnValues.voterAddress;
          return PastE;
        });
        dispatch({ type: "UPDATE_VOTER_LIST", payload: oldAddresses });
        await contract.events
          .VoterRegistered({ fromBlock: "earliest" })
          .on("data", (event) => {
            let newAddress = event.returnValues.voterAddress;
            console.log(`{Voter added: ${newAddress}`);
          })
          .on("changed", (changed) => console.log("Address changed", changed))
          .on("error", (err) =>
            console.log("Error while fetching address", err)
          )
          .on("connected", (str) => console.log("Account connected", str));
      }
    })();
  }, [contract, txhash, web3, dispatch]);

  let abortController = null;

  function handleSubmit(e) {
    e.preventDefault();

    if (voterList) {
      voterList.map((address) => {
        if (inputAddress === address) {
          alert("Address already added, please choose a different one !");
          abortController = new AbortController();
        }
      });
    }
    if (inputAddress === 0 || inputAddress === "0") {
      alert("Can't add the ZERO address !");
      abortController = new AbortController();
    } else if (!web3.utils.isAddress(inputAddress)) {
      alert("invalid address");
      abortController = new AbortController();
    } else {
      addVoter();
    }
  }

  async function addVoter() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      return;
    }
    try {
      await contract.methods.addVoter(inputAddress).send({ from: accounts[0] });
      dispatch({ type: "ADD_VOTER", payload: inputAddress });
    } catch (err) {
      console.error(err);
    }
    setInputAddress("");
  }

  function handleInputChange(e) {
    setInputAddress(e.target.value);
  }

  return (
    <div className="min-w-full">
      <form className="px-32" onSubmit={handleSubmit}>
        <label
          htmlFor="address"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Add voter address
        </label>
        <div className="flex relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="address"
            id="address"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
            placeholder="0x..."
            value={inputAddress}
            onChange={handleInputChange}
          />
          <button className="bg-teal-500 px-7 border-transparent rounded-md cursor-pointer hover:bg-teal-700 mx-4 flex">
            <span className="text-white">Register address</span>
          </button>
        </div>
      </form>
      <div className="grid x-screen place-items-center">
        <div className="mt-7">
          {voterList && (
            <ul>
              {voterList.map((address, index) => (
                <li className="mt-3" key={index}>
                  <b>Voter {index + 1}:</b> {address}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoterList;
