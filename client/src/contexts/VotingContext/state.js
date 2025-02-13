const actions = {
  init: "INIT",
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  voterList: [],
  proposalList: [],
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case "UPDATE_VOTER_LIST": {
      return {
        ...state,
        voterList: action.payload,
      };
    }
    case "ADD_VOTER": {
      return {
        ...state,
        voterList: [...state.voterList, action.payload],
      };
    }
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
