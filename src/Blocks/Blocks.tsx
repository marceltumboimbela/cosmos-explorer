import { FC } from 'react';
import type { Block, Validator } from '../App';
import { formatTimestamp, formatValidator } from '../Utils';

type BlocksProps = {
  blocks: Array<Block>
  validators: Array<Validator>
}

type BlockProps = {
  block: Block
  validators: Array<Validator>
}

const Blocks: FC<BlocksProps> = ({ blocks, validators }) => {
  return (
    <div className='grid md:grid-cols-4 gap-2'>
      {blocks.map((block, index) => (
        <Block block={block} validators={validators} key={index}/>
      ))}
    </div>
  )
}
export default Blocks;

const Block: FC<BlockProps> = ({ block, validators }) => {
  return (
    <div className='rounded-md bg-gray-700 p-3'>
      <div className='flex justify-between'>
        <p className='font-bold text-lg'>{block.header.height}</p>
        <p className='text-xs'>{formatTimestamp(block.header.time)}</p>
      </div>
      <div className='flex justify-between'>
        <p className='overflow-hidden text-ellipsis whitespace-nowrap text-sm'>{formatValidator(block.header.proposer_address, validators)}</p>
        <p className='text-sm whitespace-nowrap'>{`${block.data.txs.length} txs`}</p>
      </div>
    </div>
  )
}