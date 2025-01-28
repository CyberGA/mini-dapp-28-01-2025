import { useEffect, useState } from 'react'
import './App.css'
import abi from "./abi.json";
import { ethers } from "ethers";

const CONTRACTADDRESS = "0xf504e300cd852B5994d1C0a921438C76417e392C"

function App() {
  const [balance, setBalance] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)

   async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
  async function deposit() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTADDRESS, abi, signer);
      try {
        const tx = await contract.deposit(depositAmount);
        const receipt = tx.wait();
        console.log("  Transaction successful", receipt);
        getBalance();
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }
  async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTADDRESS, abi, signer);
      try {
        const tx = await contract.deposit(depositAmount);
        const receipt = tx.wait();
        console.log("  Transaction successful", receipt);
        getBalance();
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }
  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = new ethers.Contract(CONTRACTADDRESS, abi, provider);
      try {
        const tx = await contract.getBalance();
        setBalance(tx);
        console.log("  Transaction successful", tx);
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }

  useEffect(() => {
    getBalance()
  }, [])

  return (
    <main>
      <div className="transaction__wrapper">
        <div className="balance">
          <h2 className="balance__header">Balance</h2>
          <p className="balance__value">
            {balance}
            <span>ETH</span>
          </p>
        </div>
        <div className="transaction_action">
          <input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          <button onClick={deposit}>Deposit</button>
          <br />
          <br />
          <br />
          <input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
          <button onClick={withdraw}>Withdraw</button>
        </div>
      </div>
    </main>
  );
}

export default App
