import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import { ethers } from "ethers";
import './App.css';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  function toastMessage(text) {
    toast.info(text)  ;
  }
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);

  //contract goerli testnet
  //const addressContract = ''
  //contract Ganache
  const addressContract = '0x7136c0cA69f243d146b31B741445c619054b371e'

  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "names",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "position",
          "type": "uint256"
        }
      ],
      "name": "get",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAll",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "addName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "removeLast",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
    }
    if (contractDeployedSigner == null){
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
  }

  async function connectMetaMask (){
    if(typeof window.ethereum !== "undefined"){
        try
        {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setConnected(true)
            toastMessage("You are connected");
        }
        catch (error) {
            console.log(error);
            setConnected(false);
            toastMessage("Oops.. An error, sorry..");
        }
    }
    else {
        setConnected(false)
        toastMessage("Conect your metamask.")
      }
  }
  
  function handleName(e) {
    setName(e.target.value);
  }

  async function getNames(){
    getProvider();
    const namesLoaded = await contractDeployed.getAll();
    console.log(namesLoaded);
    setNames (namesLoaded);
    toastMessage (`Names loaded`);
  }

  async function addName(name) {
    getProvider();
    const resp = await contractDeployedSigner.addName(name);
    setNames([...names, name]);
    toastMessage('Name added');
  }

  async function removeLast(){
    getProvider();
    await contractDeployedSigner.removeLast();
    toastMessage('Last name removed, wait some seconds and reload');
  }

  useEffect(() => {
    
    //getProvider();
  
    return () => {
    
    }
  }, [])
  

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Advanced storage smart contract" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        <button onClick={connectMetaMask}>Connect your wallet</button>
        <hr/>
        <button onClick={getNames}>Get all names</button>
        <div>
          <ul>
            {names.map((nameArray, i) => 
              <li style={{listStyle: "none"}} key={i}>Name {i}: {nameArray}</li>
            )}
          </ul>
        </div>
        <button onClick={removeLast}>Remove last name</button>
        <hr/>
        <span>Type your name to save in blockchain</span>
        <input type="text" onChange={handleName} value={name}/>
        <button onClick={() => addName(name)}>Add name</button>
        

      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;
