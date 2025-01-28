import { useEffect, useState, useRef } from "react";
import "./App.css";
import abi from "./abi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONTRACTADDRESS = "0xf504e300cd852B5994d1C0a921438C76417e392C";

function App() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();
  const depositToastId = useRef();
  const withdrawToastId = useRef();

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
        depositToastId.current = toast.loading("Processing deposit...");
        const tx = await contract.deposit(depositAmount);
        const receipt = tx.wait();
        console.log("  Transaction successful", receipt);
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }
  async function withdraw() {
    if (balance < withdrawAmount) {
      toast.error("Insufficient balance");
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACTADDRESS, abi, signer);
      try {
        withdrawToastId.current = toast.loading("Processing withdrawal...");
        const tx = await contract.withdraw(withdrawAmount);
        const receipt = tx.wait();
        console.log("Transaction successful", receipt);
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
        console.log("Transaction successful", tx.toString());
        setBalance(tx.toString());
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }

  useEffect(() => {
    getBalance();

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACTADDRESS, abi, provider);

      contract.on("Deposit", (data) => {
        const value = Number.parseFloat(data.toString());
        setBalance((prevBalance) => Number.parseFloat(prevBalance) + value);
        toast.update(depositToastId.current, {
          render: `Deposit received: ${value} ETH`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        setWithdrawAmount("");
      });
      contract.on("Withdraw", (data) => {
        const value = Number.parseFloat(data.toString());
        setBalance((prevBalance) => Number.parseFloat(prevBalance) - value);
        toast.update(withdrawToastId.current, {
          render: `Withdrawal made: ${value} ETH`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        setWithdrawAmount("");
      });

      return () => {
        contract.removeAllListeners("Deposit");
        contract.removeAllListeners("Withdraw");
      };
    }
  }, []);

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
          <input
            value={depositAmount}
            placeholder="0"
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button onClick={deposit}>Deposit</button>
          <br />
          <br />
          <br />
          <input
            value={withdrawAmount}
            placeholder="0"
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button onClick={withdraw}>Withdraw</button>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}

export default App;
