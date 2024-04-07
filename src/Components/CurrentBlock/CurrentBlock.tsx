import type { Block } from '../../types';
import MenuBar from '../../assets/menubar.svg'
import { formatTime } from '../../Utils';

type CurrentBlockProps = {
  block: Block;
  handleMenuBarClick: () => void;
}

const CurrentBlock: React.FC<CurrentBlockProps> = ({ block, handleMenuBarClick }) => {
  return (
    <div className='flex mb-4 sticky top-0'>
      <div className='p-4 rounded-lg grow bg-gray-700'>
        <div className='flex gap-4 items-center'>
          <img src={MenuBar} alt='Menu Bar' className='w-6 h-6 cursor-pointer block xl:hidden' onClick={handleMenuBarClick} />
          <div>
            <p>Height: <span className='font-bold'>{block.header.height}</span></p>
            <p>Time: {formatTime(block.header.time)}</p>
            <p>Chain id: {block.header.chain_id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentBlock