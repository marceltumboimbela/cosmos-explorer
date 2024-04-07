import CosmosLogo from '../../assets/cosmos.svg'
import { Menu } from '../Menu'

const Sidebar = () => {
  return (
    <div className='sticky top-0 h-screen hidden xl:block shrink-0 w-60'>
      <div className='flex p-4 items-center justify-center gap-2'>
        <img src={CosmosLogo} alt='Cosmos Logo' className='w-12 h-12' />
        <p className='text-xl'>COSMOS EXPLORER</p>
      </div>
      <Menu/>
    </div>
  )
}

export default Sidebar