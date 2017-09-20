import IconButton from "material-ui/IconButton";
import * as React from "react";
import { Field, formValues, reduxForm } from "redux-form";
import { TextField } from "redux-form-material-ui";
import * as image from "../assets/img/commit_form_hex.png";
import { estimateNeufromEth, parseStrToNumStrict } from "../utils/utils";
import * as style from "./CommitFundsForm.scss";

const inputFieldStyles = {
  floatingLabelStyle: {
    color: "#A3C0CC",
    fontFamily: "Montserrat",
    fontWeight: 500 as 500,
    fontSize: "22px",
  },
  floatingLabelFocusStyle: {
    color: "#FFF",
    fontFamily: "Montserrat",
    fontWeight: 300 as 300, // https://github.com/Microsoft/TypeScript/issues/9489
    fontSize: "12px",
  },
  inputStyle: {
    color: "#D5E20F",
    fontWeight: 500 as 500,
    fontSize: "22px",
  },
  underlineStyle: {
    borderBottomWidth: "2px",
    borderBottomColor: "#A3C0CC",
    bottom: "5px",
  },
  underlineFocusStyle: {
    borderBottomColor: "#D5E20F",
  },
};

const iconStyles = {
  style: {
    height: "20px",
    width: "40px",
    padding: "0px 10px",
    position: "absolute" as "absolute",
    top: "42px",
  },
  iconStyle: {
    color: "#A3C0CC",
    fontSize: "20px",
  },
};

const styledField = (props: any) => {
  const computedProps = {
    name: "inputName",
    floatingLabelStyle: inputFieldStyles.floatingLabelStyle,
    floatingLabelFocusStyle: inputFieldStyles.floatingLabelFocusStyle,
    floatingLabelShrinkStyle: inputFieldStyles.floatingLabelFocusStyle,
    hintStyle: inputFieldStyles.floatingLabelStyle,
    inputStyle: inputFieldStyles.inputStyle,
    underlineStyle: inputFieldStyles.underlineStyle,
    underlineFocusStyle: inputFieldStyles.underlineFocusStyle,
    fullWidth: true,
    hintText: "Fill in the amount",
    floatingLabelText: "The ETH to be committed",
    ...props.input,
  };

  if (!props.meta.pristine && props.meta.error) {
    computedProps.errorText = props.meta.error;
  }

  return <TextField {...computedProps} />;
};

interface ICommitFundsFormProps {
  handleSubmit?: () => {};
  submit?: () => {};
  invalid?: boolean;
  ethAmount?: string;
  estimationCoefficient: number;
}

const validateETHField = (value: string) => {
  if (value === undefined) {
    return "Required";
  }

  const number = parseStrToNumStrict(value);
  if (isNaN(number)) {
    return "You must enter number";
  }

  if (number <= 0) {
    return "Number must be higher than 0";
  }

  return undefined;
};

const CommitFundsForm = ({
  handleSubmit,
  submit,
  invalid,
  ethAmount,
  estimationCoefficient,
}: ICommitFundsFormProps) => {
  let neuAmount: number = estimateNeufromEth(estimationCoefficient)(parseStrToNumStrict(ethAmount));
  if (isNaN(neuAmount)) {
    neuAmount = 0;
  }

  return (
    <form onSubmit={handleSubmit} className={style.formContainer}>
      <div className={style.formBody}>
        <div className={style.inputContainer}>
          <div className={style.input}>
            <Field name="ethAmount" component={styledField} validate={[validateETHField]} />
            <div className={style.currencyDeposit}>ETH</div>
          </div>
          <IconButton
            iconClassName="material-icons"
            style={iconStyles.style}
            iconStyle={iconStyles.iconStyle}
            tooltip="Missing description text"
          >
            info_outline
          </IconButton>
        </div>
        <p className={style.reward}>Your estimated reward</p>
        <p className={style.amount}>
          {neuAmount} <span className={style.currency}>NEU</span>
        </p>
        <p className={style.description}>
          Calculated amount might not be precised, reward will be granted after the block is mined
          and it might depend on the order of transactions.
        </p>
      </div>
      <div
        onClick={submit}
        className={invalid ? style.formSubmit : `${style.valid} ${style.formSubmit}`}
      >
        Commit ETH
      </div>
      <img className={style.hex} src={image} />
    </form>
  );
};

const DecoratedCommitFundsForm: any = formValues<ICommitFundsFormProps>("ethAmount")(
  CommitFundsForm
);

interface IFormInterface {
  ethAmount: number;
}

export default reduxForm<IFormInterface, ICommitFundsFormProps>({
  form: "commitFunds",
  onSubmit: values => {
    // tslint:disable-next-line: no-console
    console.log(values);
  },
})(DecoratedCommitFundsForm);
