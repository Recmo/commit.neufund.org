import * as React from "react";
import { Col, Row } from "react-bootstrap";
import { TextCopyable } from "../TextCopyable";
import { UnderlinedLink } from "../UnderlinedLink";
import * as style from "./CommitUnknownUserDesc.scss";

interface ICommitUnknownUserDesc {
  contractAddress: string;
  transactionPayload: string;
  gasPrice: string;
  gasLimit: string;
}

export const CommitUnknownUserDesc: React.SFC<ICommitUnknownUserDesc> = ({
  contractAddress,
  transactionPayload,
  gasPrice,
  gasLimit,
}) =>
  <div className={style.infoContainer}>
    <p>
      Include following description in your transaction:<br />
      <TextCopyable className={style.textCopyable} text={transactionPayload} />
    </p>
    <p>
      Ethereum smart contract address:<br />
      <TextCopyable className={style.textCopyable} text={contractAddress} /> <br />
      <UnderlinedLink href="#" className={style.verifyLink}>
        Verify source code on Etherscan
      </UnderlinedLink>
    </p>
    <Row className={style.gasSection}>
      <Col sm={4}>
        Suggested gas price<br />
        <TextCopyable className={style.textCopyable} text={gasPrice} />
      </Col>
      <Col sm={8}>
        Suggested gas limit<br />
        <TextCopyable className={style.textCopyable} text={gasLimit} />
      </Col>
    </Row>
  </div>;
