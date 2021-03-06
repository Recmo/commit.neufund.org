import { BigNumber } from "bignumber.js";
import * as React from "react";

import { TokenType, Web3Type } from "../actions/constants";
import { AddressIcon } from "./AddressIcon";
import MoneyComponent from "./MoneyComponent";
import { TextCopyable } from "./TextCopyable";
import { icon, userAddressContainer, value } from "./UserAddressComponent.scss";

interface IUserAddressComponentProps {
  address: string;
  balance: BigNumber;
  web3Provider: Web3Type;
}

export const UserAddressComponent: React.SFC<IUserAddressComponentProps> = ({
  address,
  web3Provider,
  balance,
}) =>
  <div className={userAddressContainer}>
    <AddressIcon address={address} className={icon} />
    <p>Your wallet address</p>
    <p className={value}>
      <TextCopyable text={address} />
    </p>
    <p>Balance</p>
    <p className={value}>
      <MoneyComponent tokenType={TokenType.ETHER} value={balance} />
    </p>
    <p>Wallet</p>
    <p className={value}>
      <span>
        {web3Provider}
      </span>
    </p>
  </div>;
