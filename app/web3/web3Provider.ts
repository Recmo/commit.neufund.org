import * as Web3 from "web3";

import { envPayload } from "../config";

export const web3Instance: any =
  typeof (window as any).web3 !== "undefined"
    ? new Web3((window as any).web3.currentProvider)
    : new Web3(new Web3.providers.HttpProvider(envPayload.rpcProvider));
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
export default web3Instance;
