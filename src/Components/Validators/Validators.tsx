import { FC, Fragment } from "react";
import type { Validator } from "../../types";
import { formatNumber, formatPercentage, formatValidatorStatus } from "../../Utils";

type ValidatorsProps = {
  validators: Array<Validator>;
}

const Validators: FC<ValidatorsProps> = ({ validators }) => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm'>
      <p className='text-base font-bold'>Name</p>
      <p className='text-base font-bold hidden lg:block'>Status</p>
      <p className='text-base font-bold'>Delegator Shares</p>
      <p className='text-base font-bold hidden lg:block'>Commission</p>

      {validators.sort((a, b) => b.delegator_shares - a.delegator_shares).slice(0, 200).map((validator, index) => (
        <Fragment key={index}>
          <p>{validator.description.moniker}</p>
          <p className="hidden lg:block">{formatValidatorStatus(validator.status)}</p>
          <p>{`${formatNumber(Math.floor(Number(validator.delegator_shares) / 1000000))} ATOM`}</p>
          <p className="hidden lg:block">{formatPercentage(validator.commission.commission_rates.rate)}</p>
        </Fragment>  
      ))}
    </div>
  )
}

export default Validators;