import { useState, useEffect, useRef } from 'react'
import './App.css'
import CosmosLogo from './assets/cosmos.svg'
import MenuBar from './assets/menubar.svg'
import Close from './assets/close.svg'
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Blocks } from './Blocks';
import { Transactions } from './Transactions';
import { Proposals } from './Proposals';
import { Validators } from './Validators';
import { formatTime } from './Utils';
import { DecodedTxRaw } from '@cosmjs/proto-signing'

export type Block = {
  header: {
    height: number;
    time: string;
    chain_id: string;
    proposer_address: string;
  },
  data: {
    txs: Array<Uint8Array>;
  }
}

export type Transaction = {
  height: number;
  hash: string;
  tx: DecodedTxRaw;
}

export type Validator = {
  description: {
    moniker: string;
  },
  status: string;
  delegator_shares: number;
  commission: {
    commission_rates: {
      rate: number;
    }
  };
  consensus_pubkey: {
    '@type': string;
    key: string;
  }
}

export type Proposal = {
  id: number;
  title: string;
  status: string;
  voting_end_time: string;
  messages: Array<{
    content: {
      '@type': string;
    }
  }>
}

const Menu = () => {
  const location = useLocation()

  return (
    <ul>
      <Link to="/">
        <li className={`p-4 cursor-pointer ${location.pathname === '/' ? 'bg-blue-500 text-white' : ''}`}>
          Blocks
        </li>
      </Link>
      <Link to="/transactions">
        <li className={`p-4 cursor-pointer ${location.pathname === '/transactions' ? 'bg-blue-500 text-white' : ''}`}>
          Transactions
        </li>
      </Link>
      <Link to="/validators">
        <li className={`p-4 cursor-pointer ${location.pathname === '/validators' ? 'bg-blue-500 text-white' : ''}`}>
          Validators
        </li>
      </Link>
      <Link to="/proposals">
        <li className={`p-4 cursor-pointer ${location.pathname === '/proposals' ? 'bg-blue-500 text-white' : ''}`}>
          Proposals
        </li>
      </Link>
    </ul>
  )
}

function App() {
  const [block, setBlock] = useState<Block | null>(null)
  const [blocks, setBlocks] = useState<Array<Block>>([])
  const [validators, setValidators] = useState<Array<Validator>>([])
  const [proposals, setProposals] = useState<Array<Proposal>>([])
  const [displayMenu, setDisplayMenu] = useState<boolean>(false)
  const timeout = useRef<number | null>(null)

  async function getBlocks() {
    fetch('https://cosmos-rest.publicnode.com/cosmos/base/tendermint/v1beta1/blocks/latest')
      .then(response => response.json())
      .then(response => {
        setBlock(response.block)
        if(blocks.length >= 50){
          blocks.shift()
        }
        setBlocks([...blocks, response.block])
      })
      .catch(err => console.error(err));
  }

  async function getValidators() {
    fetch('https://cosmos-rest.publicnode.com/cosmos/staking/v1beta1/validators?pagination.limit=500')
      .then(response => response.json())
      .then(response => setValidators(response.validators))
      .catch(err => console.error(err));
  }

  async function getProposals() {
    fetch('https://cosmos-rest.publicnode.com/cosmos/gov/v1/proposals?pagination.limit=500')
      .then(response => response.json())
      .then(response => setProposals(response.proposals))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    timeout.current = setTimeout(() => {
      getBlocks()
    }, 6000)

    return(() => {
      clearTimeout(timeout.current!)
    })
  }, [block])
  
  useEffect(() => {
    getBlocks()
    getValidators()
    getProposals()
  }, [])

  return (
    <Router>
      <div className='flex'>
        <div className='sticky top-0 h-screen hidden xl:block shrink-0 w-60'>
          <div className='flex p-4 items-center justify-center gap-2'>
            <img src={CosmosLogo} alt='Cosmos Logo' className='w-12 h-12' />
            <p className='text-xl'>COSMOS EXPLORER</p>
          </div>
          <Menu/>
        </div>
        {displayMenu && (
          <div className='fixed z-10 xl:hidden h-screen bg-[#242424] w-60'>
            <div className='flex p-4 items-center justify-center gap-2'>
              <img src={CosmosLogo} alt='Cosmos Logo' className='w-12 h-12' />
              <p className='text-xl'>COSMOS EXPLORER</p>
              <img src={Close} alt='Close' className='w-6 h-6' onClick={() => setDisplayMenu(false)} />
            </div>
            <Menu/>
          </div>
        )}
        <div className='p-4 grow'>
          {block && block.header && (
            <div className='flex mb-4 sticky top-0'>
              <div className='p-4 rounded-lg grow bg-gray-700'>
                <div className='flex gap-4 items-center'>
                  <img src={MenuBar} alt='Menu Bar' className='w-6 h-6 cursor-pointer block xl:hidden' onClick={() => setDisplayMenu(true)} />
                  <div>
                    <p>Height: <span className='font-bold'>{block.header.height}</span></p>
                    <p>Time: {formatTime(block.header.time)}</p>
                    <p>Chain id: {block.header.chain_id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Blocks blocks={blocks} validators={validators} />} />
            <Route path="/transactions" element={<Transactions blocks={blocks} />} />
            <Route path="/proposals" element={<Proposals proposals={proposals} />} />
            <Route path="/validators" element={<Validators validators={validators} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
