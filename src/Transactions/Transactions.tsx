import { FC, useMemo, Fragment } from 'react';
import { fromBase64 } from '@cosmjs/encoding';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { hashTx, formatMessage, formatTokens } from '../Utils';
import type { Block, Transaction } from '../App';

type TransactionsProps = {
  blocks: Array<Block>;
}

const Transactions: FC<TransactionsProps> = ({ blocks }) => {
  const transactions = useMemo(() => {
    const txs: Array<Transaction> = []
    if(blocks.length > 0) {
      blocks.forEach(b => 
        b.data.txs.map((tx) => {
          txs.push({
            height: b.header.height,
            hash: hashTx(tx),
            tx: decodeTxRaw(fromBase64(tx.toString())),
          })
        })
      )
    }
    return txs.sort((a, b) => b.height - a.height)
  }, [blocks])

  return (
    <div className='grid grid-cols-4 lg:grid-cols-8 gap-4 text-sm'>
      <p className='font-bold'>Height</p>
      <p className='font-bold hidden lg:block lg:col-span-4'>Hash</p>
      <p className='font-bold col-span-2'>Messages</p>
      <p className='font-bold'>Fees</p>

      {transactions.map((item, index) => (
        <Fragment key={index}>
          <p>{item.height}</p>
          <p className='hidden lg:block lg:col-span-4'>{item.hash}</p>
          <p className='col-span-2'>{formatMessage(item.tx.body.messages)}</p>
          <p>{formatTokens(item.tx.authInfo?.fee?.amount)}</p>
        </Fragment>
      ))}
    </div>
  )
}

export default Transactions