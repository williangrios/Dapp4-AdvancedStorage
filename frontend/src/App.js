import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { format6FirstsAnd6LastsChar } from "./utils";
import meta from "./assets/metamask.png";

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);

  const contractAddress = '0x4DAe7F772Ef5C1824736A7A069C0239582eD6527'

  const abi = [
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
      "type": "function"
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
      "type": "function"
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
      "type": "function"
    },
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
      "type": "function"
    }
  ];

  async function handleConnectWallet (){
    try {
      setLoading(true)
      let prov =  new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);

      let userAcc = await prov.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, abi, prov.getSigner())
      setSigner( contrSig)

    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
        }
  
        const goerliChainId = "0x5";
        const currentChainId = await window.ethereum.request({method: 'eth_chainId'})
        if (goerliChainId != currentChainId){
          toastMessage('Change to goerli testnet')
        }    
      } catch (error) {
        toastMessage(error.reason)        
      }
      
    }

    getData()  
    
  }, [])

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    return true;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
      setProvider(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }
  
  async function getNames(){

    try {
      if (!isConnected()) {
        return;
      }
      const namesLoaded = await signer.getAll();
      setNames (namesLoaded);
      toastMessage (`Names loaded`);
    } catch (error) {
      console.log(error);
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }

  }

  async function getLength(){

    try {
      if (!isConnected()) {
        return;
      }
      const length = await signer.getLength();
      toastMessage (`The length is ${length}`);
    } catch (error) {
      console.log(error);
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }

  }

  async function addName(name) {
    
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true)
      const resp = await signer.addName(name);
      await resp.wait();
      setNames([...names, name]);
      toastMessage('Name added');
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }

  }

  async function removeLast(){
    
    try {

      if (!isConnected()) {
        return;
      }
      setLoading(true)
      const resp = await signer.removeLast();
      await resp.wait();
      toastMessage('Last name removed');
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }

    
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Advanced storage smart contract" image={true} />
      <WRInfo chain="Goerli" testnet={true} />
      <WRContent>
        
        {loading && 
          <h1>Loading....</h1>
        }
        { !user.connected ?<>
            <Button className="commands" variant="btn btn-primary" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {format6FirstsAnd6LastsChar(user.account)}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        <hr/>
        
        <button className="btn btn-primary commands" onClick={getNames}>Get all names</button>
        <div>
          <ul>
            {names.map((nameArray, i) => 
              <li style={{listStyle: "none"}} key={i}>Name {i}: {nameArray}</li>
            )}
          </ul>
        </div>
        <button className="btn btn-primary commands" onClick={getLength}>Length</button>
        <hr/>
        <button className="btn btn-primary commands" onClick={removeLast}>Remove last name</button>
        <hr/>
        <span>Type your name to save in blockchain</span>
        <input className="commands" type="text" onChange={(e) => setName(e.target.value)} value={name}/>
        <button className="btn btn-primary commands" onClick={() => addName(name)}>Add name</button>
        

      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;
