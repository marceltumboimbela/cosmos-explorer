import { Link, useLocation } from 'react-router-dom';

const Menu = () => {
  const location = useLocation()

  return (
    <ul className='p-4'>
      <Link to="/">
        <li className={`p-4 rounded cursor-pointer ${location.pathname === '/' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'} `}>
          Blocks
        </li>
      </Link>
      <Link to="/transactions">
        <li className={`p-4 rounded cursor-pointer ${location.pathname === '/transactions' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'}`}>
          Transactions
        </li>
      </Link>
      <Link to="/validators">
        <li className={`p-4 rounded cursor-pointer ${location.pathname === '/validators' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'}`}>
          Validators
        </li>
      </Link>
      <Link to="/proposals">
        <li className={`p-4 rounded cursor-pointer ${location.pathname === '/proposals' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'}`}>
          Proposals
        </li>
      </Link>
    </ul>
  )
}

export default Menu